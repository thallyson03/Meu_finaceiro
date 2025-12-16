const prisma = require('../lib/prismaClient')

// Listar todos os lançamentos recorrentes
async function getRecurringTransactions(req, res) {
  try {
    const recurring = await prisma.recurringTransaction.findMany({
      where: { userId: req.userId },
      include: { account: true },
      orderBy: { createdAt: 'desc' }
    })

    // Calcular próxima data de cada lançamento
    const recurringWithNextDate = recurring.map(r => ({
      ...r,
      nextDate: calculateNextDate(r)
    }))

    // Resumo
    const activeRecurring = recurring.filter(r => r.isActive)
    const summary = {
      total: recurring.length,
      active: activeRecurring.length,
      inactive: recurring.length - activeRecurring.length,
      monthlyIncome: activeRecurring
        .filter(r => r.type === 'income' && r.frequency === 'monthly')
        .reduce((sum, r) => sum + r.amount, 0),
      monthlyExpense: activeRecurring
        .filter(r => r.type === 'expense' && r.frequency === 'monthly')
        .reduce((sum, r) => sum + r.amount, 0)
    }
    summary.monthlyBalance = summary.monthlyIncome - summary.monthlyExpense

    res.json({ recurring: recurringWithNextDate, summary })
  } catch (error) {
    console.error('Erro ao buscar lançamentos recorrentes:', error)
    res.status(500).json({ error: 'Erro ao buscar lançamentos recorrentes' })
  }
}

// Criar lançamento recorrente
async function createRecurringTransaction(req, res) {
  try {
    const { 
      description, category, amount, type, frequency, 
      dayOfMonth, dayOfWeek, startDate, endDate, accountId 
    } = req.body

    if (!description || !category || !amount || !type || !frequency) {
      return res.status(400).json({ 
        error: 'Descrição, categoria, valor, tipo e frequência são obrigatórios' 
      })
    }

    const recurring = await prisma.recurringTransaction.create({
      data: {
        userId: req.userId,
        description,
        category,
        amount: parseFloat(amount),
        type,
        frequency,
        dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : null,
        dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        accountId: accountId ? parseInt(accountId) : null
      },
      include: { account: true }
    })

    res.status(201).json(recurring)
  } catch (error) {
    console.error('Erro ao criar lançamento recorrente:', error)
    res.status(500).json({ error: 'Erro ao criar lançamento recorrente' })
  }
}

// Atualizar lançamento recorrente
async function updateRecurringTransaction(req, res) {
  try {
    const { id } = req.params
    const { 
      description, category, amount, type, frequency, 
      dayOfMonth, dayOfWeek, startDate, endDate, isActive, accountId 
    } = req.body

    const existing = await prisma.recurringTransaction.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Lançamento recorrente não encontrado' })
    }

    const recurring = await prisma.recurringTransaction.update({
      where: { id: parseInt(id) },
      data: {
        description: description || existing.description,
        category: category || existing.category,
        amount: amount ? parseFloat(amount) : existing.amount,
        type: type || existing.type,
        frequency: frequency || existing.frequency,
        dayOfMonth: dayOfMonth !== undefined ? parseInt(dayOfMonth) : existing.dayOfMonth,
        dayOfWeek: dayOfWeek !== undefined ? parseInt(dayOfWeek) : existing.dayOfWeek,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        accountId: accountId !== undefined ? (accountId ? parseInt(accountId) : null) : existing.accountId
      },
      include: { account: true }
    })

    res.json(recurring)
  } catch (error) {
    console.error('Erro ao atualizar lançamento recorrente:', error)
    res.status(500).json({ error: 'Erro ao atualizar lançamento recorrente' })
  }
}

// Deletar lançamento recorrente
async function deleteRecurringTransaction(req, res) {
  try {
    const { id } = req.params

    const existing = await prisma.recurringTransaction.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Lançamento recorrente não encontrado' })
    }

    await prisma.recurringTransaction.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Lançamento recorrente excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir lançamento recorrente:', error)
    res.status(500).json({ error: 'Erro ao excluir lançamento recorrente' })
  }
}

// Gerar transações pendentes para o mês atual
async function generatePendingTransactions(req, res) {
  try {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const activeRecurring = await prisma.recurringTransaction.findMany({
      where: { 
        userId: req.userId,
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      }
    })

    const generatedTransactions = []

    for (const recurring of activeRecurring) {
      // Verificar se já foi gerada transação para este mês
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          userId: req.userId,
          description: { contains: recurring.description },
          date: {
            gte: new Date(currentYear, currentMonth, 1),
            lt: new Date(currentYear, currentMonth + 1, 1)
          }
        }
      })

      if (!existingTransaction) {
        // Criar a transação
        const transactionDate = new Date(currentYear, currentMonth, recurring.dayOfMonth || 1)
        
        const transaction = await prisma.transaction.create({
          data: {
            userId: req.userId,
            description: `${recurring.description} (Recorrente)`,
            category: recurring.category,
            amount: recurring.type === 'expense' ? -Math.abs(recurring.amount) : Math.abs(recurring.amount),
            type: recurring.type,
            date: transactionDate,
            accountId: recurring.accountId,
            isPaid: false
          }
        })

        // Atualizar lastGenerated
        await prisma.recurringTransaction.update({
          where: { id: recurring.id },
          data: { lastGenerated: now }
        })

        generatedTransactions.push(transaction)
      }
    }

    res.json({ 
      message: `${generatedTransactions.length} transações geradas`,
      transactions: generatedTransactions
    })
  } catch (error) {
    console.error('Erro ao gerar transações:', error)
    res.status(500).json({ error: 'Erro ao gerar transações pendentes' })
  }
}

// Alternar status ativo/inativo
async function toggleRecurringStatus(req, res) {
  try {
    const { id } = req.params

    const existing = await prisma.recurringTransaction.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Lançamento recorrente não encontrado' })
    }

    const recurring = await prisma.recurringTransaction.update({
      where: { id: parseInt(id) },
      data: { isActive: !existing.isActive },
      include: { account: true }
    })

    res.json(recurring)
  } catch (error) {
    console.error('Erro ao alternar status:', error)
    res.status(500).json({ error: 'Erro ao alternar status' })
  }
}

// Função auxiliar para calcular próxima data
function calculateNextDate(recurring) {
  const now = new Date()
  let nextDate = new Date()

  if (recurring.frequency === 'monthly') {
    nextDate.setDate(recurring.dayOfMonth || 1)
    if (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1)
    }
  } else if (recurring.frequency === 'weekly') {
    const currentDay = now.getDay()
    const targetDay = recurring.dayOfWeek || 0
    let daysUntil = targetDay - currentDay
    if (daysUntil <= 0) daysUntil += 7
    nextDate.setDate(now.getDate() + daysUntil)
  } else if (recurring.frequency === 'yearly') {
    const startDate = new Date(recurring.startDate)
    nextDate.setMonth(startDate.getMonth())
    nextDate.setDate(startDate.getDate())
    if (nextDate <= now) {
      nextDate.setFullYear(nextDate.getFullYear() + 1)
    }
  }

  return nextDate
}

module.exports = {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  generatePendingTransactions,
  toggleRecurringStatus
}

