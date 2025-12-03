const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const txRoutes = require('./routes/transactions.routes');
const invRoutes = require('./routes/invoices.routes');
const incomesRoutes = require('./routes/incomes.routes');
const budgetsRoutes = require('./routes/budgets.routes');
const installmentsRoutes = require('./routes/installments.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/invoices', invRoutes);
app.use('/api/incomes', incomesRoutes);
app.use('/api/budgets', budgetsRoutes);
app.use('/api/budget', budgetsRoutes); // Alias para compatibilidade
app.use('/api/installments', installmentsRoutes);

app.use(errorMiddleware);

module.exports = app;
