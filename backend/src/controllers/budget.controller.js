const prisma = require('../lib/prismaClient');

// Obter orçamentos do mês atual
exports.getCurrentMonth = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.userId,
        month,
        year
      }
    });
    
    res.json(budgets);
  } catch (err) { next(err); }
};

// Criar ou atualizar orçamento
exports.createOrUpdate = async (req, res, next) => {
  try {
    const { category, limit, month, year } = req.body;
    
    const budget = await prisma.budget.upsert({
      where: {
        userId_month_year_category: {
          userId: req.userId,
          month: parseInt(month),
          year: parseInt(year),
          category
        }
      },
      update: {
        limit: parseFloat(limit)
      },
      create: {
        userId: req.userId,
        category,
        limit: parseFloat(limit),
        month: parseInt(month),
        year: parseInt(year)
      }
    });
    
    res.json(budget);
  } catch (err) { next(err); }
};

// Deletar orçamento
exports.delete = async (req, res, next) => {
  try {
    await prisma.budget.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Orçamento deletado' });
  } catch (err) { next(err); }
};

// Obter resumo financeiro completo
exports.getFinancialSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    // Buscar todas as transações do mês atual
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    // Buscar orçamentos do mês
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.userId,
        month,
        year
      }
    });
    
    // Calcular receitas e despesas
    const incomes = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpense;
    
    // Gastos por categoria
    const expensesByCategory = {};
    expenses.forEach(t => {
      const cat = t.category;
      if (!expensesByCategory[cat]) {
        expensesByCategory[cat] = 0;
      }
      expensesByCategory[cat] += Math.abs(t.amount);
    });
    
    // Comparar com orçamento
    const budgetComparison = budgets.map(budget => {
      const spent = expensesByCategory[budget.category] || 0;
      const remaining = budget.limit - spent;
      const percentage = (spent / budget.limit) * 100;
      
      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'ok'
      };
    });
    
    res.json({
      month,
      year,
      totalIncome,
      totalExpense,
      balance,
      incomes: incomes.length,
      expenses: expenses.length,
      expensesByCategory,
      budgetComparison,
      availableToSpend: balance
    });
  } catch (err) { next(err); }
};






