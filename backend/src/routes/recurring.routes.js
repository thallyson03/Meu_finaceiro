const express = require('express')
const router = express.Router()
const recurringController = require('../controllers/recurring.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Todas as rotas requerem autenticação
router.use(authMiddleware)

// CRUD de lançamentos recorrentes
router.get('/', recurringController.getRecurringTransactions)
router.post('/', recurringController.createRecurringTransaction)
router.put('/:id', recurringController.updateRecurringTransaction)
router.delete('/:id', recurringController.deleteRecurringTransaction)

// Ações especiais
router.post('/generate', recurringController.generatePendingTransactions)
router.post('/:id/toggle', recurringController.toggleRecurringStatus)

module.exports = router

