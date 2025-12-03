const prisma = require('../lib/prismaClient');

exports.list = async (req, res, next) => {
  try {
    const txs = await prisma.transaction.findMany({ where: { userId: req.userId }, orderBy: { date: 'desc' } });
    res.json(txs);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { description, category, amount, date, card, installments, isPaid, type } = req.body;
    const tx = await prisma.transaction.create({ 
      data: { 
        userId: req.userId, 
        description, 
        category, 
        amount: parseFloat(amount), 
        date: new Date(date), 
        card, 
        installments: installments ? parseInt(installments) : null,
        isPaid: isPaid !== undefined ? isPaid : true,
        type: type || 'expense'
      } 
    });
    res.status(201).json(tx);
  } catch (err) { next(err); }
};

exports.summary = async (req, res, next) => {
  try {
    const since = new Date(); since.setMonth(since.getMonth() - 6);
    const txs = await prisma.transaction.findMany({ where: { userId: req.userId, date: { gte: since } }, orderBy: { date: 'asc' } });

    const byCategory = {};
    const incomes = txs.filter(t => t.type === 'income');
    const expenses = txs.filter(t => t.type === 'expense');
    
    expenses.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + Math.abs(t.amount);
    });
    
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
    
    res.json({ 
      byCategory, 
      total: totalExpense,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    });
  } catch (err) { next(err); }
};
