const prisma = require('../lib/prismaClient')

// Listar todas as contas do usuário
async function getAccounts(req, res) {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' }
    })

    // Calcular saldo real de cada conta baseado nas transações
    const accountsWithBalance = await Promise.all(accounts.map(async (account) => {
      const transactions = await prisma.transaction.findMany({
        where: { accountId: account.id }
      })

      const calculatedBalance = transactions.reduce((sum, t) => {
        return sum + (t.type === 'income' ? Math.abs(t.amount) : -Math.abs(t.amount))
      }, account.balance)

      return {
        ...account,
        calculatedBalance,
        transactionCount: transactions.length
      }
    }))

    // Resumo geral - patrimônio NÃO inclui cartões de crédito
    const patrimonio = accountsWithBalance
      .filter(a => a.type !== 'credit' && a.isActive)
      .reduce((sum, a) => sum + a.calculatedBalance, 0)
    
    const totalCreditUsed = accountsWithBalance
      .filter(a => a.type === 'credit')
      .reduce((sum, a) => sum + (a.usedCredit || 0), 0)
    
    const totalCreditLimit = accountsWithBalance
      .filter(a => a.type === 'credit')
      .reduce((sum, a) => sum + (a.creditLimit || 0), 0)

    const summary = {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(a => a.isActive).length,
      patrimonio, // Apenas contas (sem cartões)
      totalBalance: patrimonio, // Mantido para compatibilidade
      creditCards: {
        totalLimit: totalCreditLimit,
        usedCredit: totalCreditUsed,
        availableCredit: totalCreditLimit - totalCreditUsed
      },
      byType: {
        checking: accountsWithBalance
          .filter(a => a.type === 'checking')
          .reduce((sum, a) => sum + a.calculatedBalance, 0),
        savings: accountsWithBalance
          .filter(a => a.type === 'savings')
          .reduce((sum, a) => sum + a.calculatedBalance, 0),
        credit: totalCreditUsed,
        investment: accountsWithBalance
          .filter(a => a.type === 'investment')
          .reduce((sum, a) => sum + a.calculatedBalance, 0)
      }
    }

    res.json({ accounts: accountsWithBalance, summary })
  } catch (error) {
    console.error('Erro ao buscar contas:', error)
    res.status(500).json({ error: 'Erro ao buscar contas' })
  }
}

// Criar nova conta
async function createAccount(req, res) {
  try {
    const { name, type, balance, creditLimit, color, icon } = req.body

    if (!name || !type) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' })
    }

    const validTypes = ['checking', 'savings', 'credit', 'investment']
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Tipo inválido. Use: checking, savings, credit ou investment' 
      })
    }

    // Se for cartão de crédito, exige limite
    if (type === 'credit' && !creditLimit) {
      return res.status(400).json({ 
        error: 'Limite de crédito é obrigatório para cartões' 
      })
    }

    const account = await prisma.account.create({
      data: {
        userId: req.userId,
        name,
        type,
        balance: type === 'credit' ? 0 : parseFloat(balance || 0),
        creditLimit: type === 'credit' ? parseFloat(creditLimit) : null,
        usedCredit: 0,
        color: color || getDefaultColor(type),
        icon: icon || getDefaultIcon(type)
      }
    })

    res.status(201).json(account)
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
}

// Atualizar conta
async function updateAccount(req, res) {
  try {
    const { id } = req.params
    const { name, type, balance, color, icon, isActive } = req.body

    const existing = await prisma.account.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Conta não encontrada' })
    }

    const account = await prisma.account.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existing.name,
        type: type || existing.type,
        balance: balance !== undefined ? parseFloat(balance) : existing.balance,
        color: color || existing.color,
        icon: icon || existing.icon,
        isActive: isActive !== undefined ? isActive : existing.isActive
      }
    })

    res.json(account)
  } catch (error) {
    console.error('Erro ao atualizar conta:', error)
    res.status(500).json({ error: 'Erro ao atualizar conta' })
  }
}

// Deletar conta
async function deleteAccount(req, res) {
  try {
    const { id } = req.params

    const existing = await prisma.account.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Conta não encontrada' })
    }

    // Verificar se há transações vinculadas
    const transactionCount = await prisma.transaction.count({
      where: { accountId: parseInt(id) }
    })

    if (transactionCount > 0) {
      return res.status(400).json({ 
        error: `Não é possível excluir. Existem ${transactionCount} transações vinculadas a esta conta.`,
        suggestion: 'Desvincule as transações primeiro ou desative a conta.'
      })
    }

    await prisma.account.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Conta excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir conta:', error)
    res.status(500).json({ error: 'Erro ao excluir conta' })
  }
}

// Transferir entre contas
async function transferBetweenAccounts(req, res) {
  try {
    const { fromAccountId, toAccountId, amount, description } = req.body

    if (!fromAccountId || !toAccountId || !amount) {
      return res.status(400).json({ 
        error: 'Conta de origem, destino e valor são obrigatórios' 
      })
    }

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ error: 'As contas devem ser diferentes' })
    }

    const fromAccount = await prisma.account.findFirst({
      where: { id: parseInt(fromAccountId), userId: req.userId }
    })

    const toAccount = await prisma.account.findFirst({
      where: { id: parseInt(toAccountId), userId: req.userId }
    })

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: 'Uma ou ambas as contas não foram encontradas' })
    }

    const transferAmount = parseFloat(amount)
    const now = new Date()

    // Criar transação de saída
    const outTransaction = await prisma.transaction.create({
      data: {
        userId: req.userId,
        description: description || `Transferência para ${toAccount.name}`,
        category: 'Transferência',
        amount: -transferAmount,
        type: 'expense',
        date: now,
        accountId: fromAccount.id,
        isPaid: true
      }
    })

    // Criar transação de entrada
    const inTransaction = await prisma.transaction.create({
      data: {
        userId: req.userId,
        description: description || `Transferência de ${fromAccount.name}`,
        category: 'Transferência',
        amount: transferAmount,
        type: 'income',
        date: now,
        accountId: toAccount.id,
        isPaid: true
      }
    })

    res.json({
      message: 'Transferência realizada com sucesso',
      outTransaction,
      inTransaction
    })
  } catch (error) {
    console.error('Erro ao transferir:', error)
    res.status(500).json({ error: 'Erro ao realizar transferência' })
  }
}

// Obter histórico de transações de uma conta
async function getAccountTransactions(req, res) {
  try {
    const { id } = req.params
    const { limit = 50 } = req.query

    const account = await prisma.account.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' })
    }

    const transactions = await prisma.transaction.findMany({
      where: { accountId: parseInt(id) },
      orderBy: { date: 'desc' },
      take: parseInt(limit)
    })

    res.json({ account, transactions })
  } catch (error) {
    console.error('Erro ao buscar transações da conta:', error)
    res.status(500).json({ error: 'Erro ao buscar transações da conta' })
  }
}

// Funções auxiliares
function getDefaultColor(type) {
  const colors = {
    checking: '#3B82F6', // Azul
    savings: '#10B981', // Verde
    credit: '#EF4444', // Vermelho
    investment: '#8B5CF6' // Roxo
  }
  return colors[type] || '#6B7280'
}

function getDefaultIcon(type) {
  const icons = {
    checking: 'building-columns',
    savings: 'piggy-bank',
    credit: 'credit-card',
    investment: 'chart-line'
  }
  return icons[type] || 'wallet'
}

// Atualizar saldo de uma conta (crédito ou débito)
async function updateAccountBalance(req, res) {
  try {
    const { id } = req.params
    const { amount, operation } = req.body // operation: 'credit' (adicionar) ou 'debit' (subtrair)

    const account = await prisma.account.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' })
    }

    const value = parseFloat(amount)
    let newBalance = account.balance

    if (account.type === 'credit') {
      // Para cartão de crédito, atualizar crédito usado
      let newUsedCredit = account.usedCredit || 0
      
      if (operation === 'debit') {
        // Usar crédito (compra)
        newUsedCredit += value
        if (newUsedCredit > account.creditLimit) {
          return res.status(400).json({ error: 'Limite de crédito excedido' })
        }
      } else {
        // Pagar fatura (reduzir crédito usado)
        newUsedCredit = Math.max(0, newUsedCredit - value)
      }

      const updated = await prisma.account.update({
        where: { id: parseInt(id) },
        data: { usedCredit: newUsedCredit }
      })

      return res.json(updated)
    } else {
      // Para outras contas, atualizar saldo
      if (operation === 'credit') {
        newBalance += value
      } else {
        newBalance -= value
      }

      const updated = await prisma.account.update({
        where: { id: parseInt(id) },
        data: { balance: newBalance }
      })

      return res.json(updated)
    }
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error)
    res.status(500).json({ error: 'Erro ao atualizar saldo' })
  }
}

// Obter lista simplificada de contas (para selects)
async function getAccountsSimple(req, res) {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.userId, isActive: true },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        creditLimit: true,
        usedCredit: true,
        color: true
      },
      orderBy: { name: 'asc' }
    })

    // Separar contas de cartões
    const regularAccounts = accounts.filter(a => a.type !== 'credit')
    const creditCards = accounts.filter(a => a.type === 'credit').map(c => ({
      ...c,
      availableCredit: (c.creditLimit || 0) - (c.usedCredit || 0)
    }))

    res.json({ accounts: regularAccounts, creditCards })
  } catch (error) {
    console.error('Erro ao buscar contas:', error)
    res.status(500).json({ error: 'Erro ao buscar contas' })
  }
}

module.exports = {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  transferBetweenAccounts,
  getAccountTransactions,
  updateAccountBalance,
  getAccountsSimple
}

