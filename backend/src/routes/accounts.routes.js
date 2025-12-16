const express = require('express')
const router = express.Router()
const accountsController = require('../controllers/accounts.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Todas as rotas requerem autenticação
router.use(authMiddleware)

// CRUD de contas
router.get('/', accountsController.getAccounts)
router.get('/simple', accountsController.getAccountsSimple) // Lista simplificada para selects
router.post('/', accountsController.createAccount)
router.put('/:id', accountsController.updateAccount)
router.delete('/:id', accountsController.deleteAccount)

// Ações especiais
router.post('/transfer', accountsController.transferBetweenAccounts)
router.get('/:id/transactions', accountsController.getAccountTransactions)
router.post('/:id/balance', accountsController.updateAccountBalance) // Atualizar saldo

module.exports = router

