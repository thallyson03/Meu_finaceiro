const prisma = require('../lib/prismaClient');

exports.list = async (req, res, next) => {
  try {
    const incomes = await prisma.income.findMany({ 
      where: { userId: req.userId }, 
      orderBy: { date: 'desc' } 
    });
    res.json(incomes);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { description, amount, date, type, recurring } = req.body;
    const income = await prisma.income.create({ 
      data: { 
        userId: req.userId, 
        description, 
        amount: parseFloat(amount), 
        date: new Date(date), 
        type,
        recurring: recurring || false
      } 
    });
    res.status(201).json(income);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.income.deleteMany({ 
      where: { id: parseInt(id), userId: req.userId } 
    });
    res.json({ message: 'Receita excluída' });
  } catch (err) { next(err); }
};

exports.summary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);
    
    const incomes = await prisma.income.findMany({ 
      where: { 
        userId: req.userId,
        date: { gte: startDate, lte: endDate }
      } 
    });
    
    const total = incomes.reduce((sum, income) => sum + income.amount, 0);
    const byType = {};
    incomes.forEach(i => {
      byType[i.type] = (byType[i.type] || 0) + i.amount;
    });
    
    res.json({ total, byType, incomes });
  } catch (err) { next(err); }
};

