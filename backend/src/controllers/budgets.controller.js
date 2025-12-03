const prisma = require('../lib/prismaClient');

exports.list = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    const budgets = await prisma.budget.findMany({ 
      where: { 
        userId: req.userId,
        month: currentMonth,
        year: currentYear
      } 
    });
    res.json(budgets);
  } catch (err) { next(err); }
};

exports.createOrUpdate = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;
    
    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: req.userId,
          category,
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      update: {
        amount: parseFloat(amount)
      },
      create: {
        userId: req.userId,
        category,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year)
      }
    });
    
    res.json(budget);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.budget.deleteMany({ 
      where: { id: parseInt(id), userId: req.userId } 
    });
    res.json({ message: 'Orçamento excluído' });
  } catch (err) { next(err); }
};

exports.comparison = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Buscar orçamentos
    const budgets = await prisma.budget.findMany({ 
      where: { 
        userId: req.userId,
        month: currentMonth,
        year: currentYear
      } 
    });
    
    // Buscar gastos reais
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        type: 'expense',
        date: { gte: startDate, lte: endDate }
      }
    });
    
    // Agrupar gastos por categoria
    const spentByCategory = {};
    transactions.forEach(t => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + Math.abs(t.amount);
    });
    
    // Comparar
    const comparison = budgets.map(budget => ({
      category: budget.category,
      budgeted: budget.amount,
      spent: spentByCategory[budget.category] || 0,
      remaining: budget.amount - (spentByCategory[budget.category] || 0),
      percentage: ((spentByCategory[budget.category] || 0) / budget.amount) * 100
    }));
    
    // Categorias sem orçamento mas com gastos
    Object.keys(spentByCategory).forEach(category => {
      if (!budgets.find(b => b.category === category)) {
        comparison.push({
          category,
          budgeted: 0,
          spent: spentByCategory[category],
          remaining: -spentByCategory[category],
          percentage: 0
        });
      }
    });
    
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = Object.values(spentByCategory).reduce((sum, val) => sum + val, 0);
    
    res.json({ 
      comparison, 
      totals: {
        budgeted: totalBudgeted,
        spent: totalSpent,
        remaining: totalBudgeted - totalSpent
      }
    });
  } catch (err) { next(err); }
};

