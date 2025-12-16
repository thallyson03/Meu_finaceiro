const prisma = require('../lib/prismaClient')

// Exportar transações em CSV
async function exportTransactionsCSV(req, res) {
  try {
    const { startDate, endDate, type } = req.query

    const where = { userId: req.user.id }
    
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }
    
    if (type && type !== 'all') {
      where.type = type
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { account: true }
    })

    // Criar CSV
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Conta', 'Parcelas', 'Pago']
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.amount.toFixed(2).replace('.', ','),
      t.account?.name || '-',
      t.installments || '-',
      t.isPaid ? 'Sim' : 'Não'
    ])

    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')

    // Adicionar BOM para Excel reconhecer UTF-8
    const bom = '\uFEFF'
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename=transacoes.csv')
    res.send(bom + csv)
  } catch (error) {
    console.error('Erro ao exportar:', error)
    res.status(500).json({ error: 'Erro ao exportar transações' })
  }
}

// Exportar relatório completo em JSON
async function exportFullReport(req, res) {
  try {
    const userId = req.user.id

    const [transactions, budgets, goals, recurring, accounts] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      }),
      prisma.budget.findMany({
        where: { userId }
      }),
      prisma.goal.findMany({
        where: { userId }
      }),
      prisma.recurringTransaction.findMany({
        where: { userId }
      }),
      prisma.account.findMany({
        where: { userId }
      })
    ])

    // Calcular estatísticas
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTransactions: transactions.length,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.isCompleted).length,
        totalAccounts: accounts.length,
        activeRecurring: recurring.filter(r => r.isActive).length
      },
      transactions,
      budgets,
      goals,
      recurring,
      accounts
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-financeiro.json')
    res.json(report)
  } catch (error) {
    console.error('Erro ao exportar relatório:', error)
    res.status(500).json({ error: 'Erro ao exportar relatório' })
  }
}

// Gerar relatório em formato de texto para impressão
async function exportPrintableReport(req, res) {
  try {
    const { month, year } = req.query
    const userId = req.user.id

    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1
    const currentYear = year ? parseInt(year) : new Date().getFullYear()

    const startDate = new Date(currentYear, currentMonth - 1, 1)
    const endDate = new Date(currentYear, currentMonth, 0)

    const [transactions, budgets, goals] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startDate, lte: endDate }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.budget.findMany({
        where: { userId, month: currentMonth, year: currentYear }
      }),
      prisma.goal.findMany({
        where: { userId }
      })
    ])

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Agrupar despesas por categoria
    const expensesByCategory = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount)
      })

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const report = {
      title: `Relatório Financeiro - ${monthNames[currentMonth - 1]} ${currentYear}`,
      period: { month: currentMonth, year: currentYear, monthName: monthNames[currentMonth - 1] },
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: transactions.length
      },
      expensesByCategory,
      budgetComparison: budgets.map(b => {
        const spent = expensesByCategory[b.category] || 0
        return {
          category: b.category,
          limit: b.limit,
          spent,
          remaining: b.limit - spent,
          percentage: (spent / b.limit) * 100
        }
      }),
      goals: goals.map(g => ({
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        progress: (g.currentAmount / g.targetAmount) * 100,
        isCompleted: g.isCompleted
      })),
      transactions: transactions.map(t => ({
        date: new Date(t.date).toLocaleDateString('pt-BR'),
        description: t.description,
        category: t.category,
        type: t.type,
        amount: t.amount
      }))
    }

    res.json(report)
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    res.status(500).json({ error: 'Erro ao gerar relatório' })
  }
}

module.exports = {
  exportTransactionsCSV,
  exportFullReport,
  exportPrintableReport
}

