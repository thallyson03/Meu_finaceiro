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
    const { month, year } = req.query;
    
    let startDate, endDate;
    
    if (month && year) {
      // Filtrar por mês específico
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    } else {
      // Mês atual por padrão
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }
    
    const txs = await prisma.transaction.findMany({ 
      where: { 
        userId: req.userId, 
        date: { 
          gte: startDate,
          lte: endDate
        } 
      }, 
      orderBy: { date: 'asc' } 
    });

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
      balance: totalIncome - totalExpense,
      period: {
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
        startDate,
        endDate
      }
    });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar se a transação pertence ao usuário
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    // Se a transação estava paga e tinha conta associada, reverter o saldo
    if (transaction.isPaid && transaction.accountId) {
      const account = await prisma.account.findUnique({
        where: { id: transaction.accountId }
      });
      
      if (account) {
        if (account.type === 'credit') {
          // Reverter uso do crédito
          const amount = Math.abs(transaction.amount);
          await prisma.account.update({
            where: { id: account.id },
            data: { usedCredit: Math.max(0, (account.usedCredit || 0) - amount) }
          });
        } else {
          // Reverter saldo
          const amount = transaction.type === 'income' 
            ? -Math.abs(transaction.amount) 
            : Math.abs(transaction.amount);
          await prisma.account.update({
            where: { id: account.id },
            data: { balance: account.balance + amount }
          });
        }
      }
    }
    
    await prisma.transaction.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Transação excluída com sucesso' });
  } catch (err) { next(err); }
};

// Pagar uma transação (marcar como paga e debitar da conta)
exports.pay = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accountId } = req.body;
    
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    if (transaction.isPaid) {
      return res.status(400).json({ error: 'Transação já está paga' });
    }
    
    // Se informou conta, atualizar saldo
    if (accountId) {
      const account = await prisma.account.findFirst({
        where: { id: parseInt(accountId), userId: req.userId }
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }
      
      const amount = Math.abs(transaction.amount);
      
      if (account.type === 'credit') {
        // Usar crédito do cartão
        const newUsedCredit = (account.usedCredit || 0) + amount;
        if (newUsedCredit > account.creditLimit) {
          return res.status(400).json({ error: 'Limite de crédito excedido' });
        }
        await prisma.account.update({
          where: { id: account.id },
          data: { usedCredit: newUsedCredit }
        });
      } else {
        // Debitar da conta (despesa) ou creditar (receita)
        const newBalance = transaction.type === 'expense'
          ? account.balance - amount
          : account.balance + amount;
        
        await prisma.account.update({
          where: { id: account.id },
          data: { balance: newBalance }
        });
      }
    }
    
    // Marcar como paga
    const updated = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { 
        isPaid: true,
        accountId: accountId ? parseInt(accountId) : transaction.accountId
      }
    });
    
    res.json({ message: 'Transação paga com sucesso', transaction: updated });
  } catch (err) { next(err); }
};

// Receber receita (marcar como recebida e creditar na conta)
exports.receive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accountId } = req.body;
    
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id), userId: req.userId, type: 'income' }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }
    
    if (transaction.isPaid) {
      return res.status(400).json({ error: 'Receita já foi recebida' });
    }
    
    // Se informou conta, creditar o valor
    if (accountId) {
      const account = await prisma.account.findFirst({
        where: { id: parseInt(accountId), userId: req.userId }
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }
      
      if (account.type === 'credit') {
        return res.status(400).json({ error: 'Não é possível receber em cartão de crédito' });
      }
      
      const amount = Math.abs(transaction.amount);
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: account.balance + amount }
      });
    }
    
    // Marcar como recebida
    const updated = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { 
        isPaid: true,
        accountId: accountId ? parseInt(accountId) : transaction.accountId
      }
    });
    
    res.json({ message: 'Receita recebida com sucesso', transaction: updated });
  } catch (err) { next(err); }
};
