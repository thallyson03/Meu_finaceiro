const prisma = require('../lib/prismaClient');

// Obter todas as compras parceladas
exports.getAll = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        installments: { not: null, gt: 1 }
      },
      orderBy: { date: 'desc' }
    });
    
    // Calcular informações de parcelas
    const installmentsData = transactions.map(tx => {
      const totalAmount = Math.abs(tx.amount);
      const installmentValue = totalAmount / tx.installments;
      const firstPaymentDate = new Date(tx.date);
      const currentDate = new Date();
      
      // Calcular quantas parcelas já venceram
      const monthsDiff = (currentDate.getFullYear() - firstPaymentDate.getFullYear()) * 12 
                        + (currentDate.getMonth() - firstPaymentDate.getMonth());
      const paidInstallments = Math.min(Math.max(monthsDiff + 1, 0), tx.installments);
      const remainingInstallments = tx.installments - paidInstallments;
      const paidAmount = paidInstallments * installmentValue;
      const remainingAmount = remainingInstallments * installmentValue;
      
      // Próximas parcelas
      const nextInstallments = [];
      for(let i = paidInstallments; i < Math.min(paidInstallments + 3, tx.installments); i++) {
        const dueDate = new Date(firstPaymentDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        nextInstallments.push({
          number: i + 1,
          value: installmentValue,
          dueDate: dueDate.toISOString()
        });
      }
      
      return {
        id: tx.id,
        description: tx.description,
        category: tx.category,
        card: tx.card,
        startDate: tx.date,
        totalAmount,
        installmentValue,
        totalInstallments: tx.installments,
        paidInstallments,
        remainingInstallments,
        paidAmount,
        remainingAmount,
        progressPercentage: (paidInstallments / tx.installments) * 100,
        nextInstallments
      };
    });
    
    // Resumo geral
    const summary = {
      total: installmentsData.length,
      totalAmount: installmentsData.reduce((sum, i) => sum + i.totalAmount, 0),
      paidAmount: installmentsData.reduce((sum, i) => sum + i.paidAmount, 0),
      remainingAmount: installmentsData.reduce((sum, i) => sum + i.remainingAmount, 0),
      activeInstallments: installmentsData.filter(i => i.remainingInstallments > 0).length
    };
    
    res.json({ installments: installmentsData, summary });
  } catch (err) { next(err); }
};

// Obter balanceamento mensal (últimos 12 meses)
exports.getMonthlyBalance = async (req, res, next) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    });
    
    // Agrupar por mês
    const monthlyData = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          monthKey,
          income: 0,
          expense: 0,
          balance: 0,
          transactions: 0
        };
      }
      
      if (tx.type === 'income') {
        monthlyData[monthKey].income += tx.amount;
      } else {
        monthlyData[monthKey].expense += Math.abs(tx.amount);
      }
      monthlyData[monthKey].transactions++;
    });
    
    // Calcular balance e acumulado
    let accumulated = 0;
    const monthlyArray = Object.values(monthlyData).map(month => {
      month.balance = month.income - month.expense;
      accumulated += month.balance;
      month.accumulated = accumulated;
      return month;
    });
    
    res.json({
      months: monthlyArray,
      totalIncome: monthlyArray.reduce((sum, m) => sum + m.income, 0),
      totalExpense: monthlyArray.reduce((sum, m) => sum + m.expense, 0),
      finalBalance: accumulated
    });
  } catch (err) { next(err); }
};

// Projeção de parcelas futuras (próximos 6 meses)
exports.getFutureProjection = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        installments: { not: null, gt: 1 }
      }
    });
    
    const now = new Date();
    const projection = {};
    
    // Inicializar próximos 6 meses
    for(let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      projection[monthKey] = {
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        amount: 0,
        count: 0
      };
    }
    
    // Calcular parcelas que vencerão em cada mês
    transactions.forEach(tx => {
      const totalAmount = Math.abs(tx.amount);
      const installmentValue = totalAmount / tx.installments;
      const firstPaymentDate = new Date(tx.date);
      
      for(let i = 0; i < tx.installments; i++) {
        const dueDate = new Date(firstPaymentDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        
        // Se está dentro dos próximos 6 meses
        if (dueDate >= now) {
          const monthKey = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
          if (projection[monthKey]) {
            projection[monthKey].amount += installmentValue;
            projection[monthKey].count++;
          }
        }
      }
    });
    
    res.json({ projection: Object.values(projection) });
  } catch (err) { next(err); }
};






