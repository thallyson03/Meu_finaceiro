const express = require('express')
const router = express.Router()
const exportController = require('../controllers/export.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Todas as rotas requerem autenticação
router.use(authMiddleware)

// Exportações
router.get('/transactions/csv', exportController.exportTransactionsCSV)
router.get('/full', exportController.exportFullReport)
router.get('/report', exportController.exportPrintableReport)

module.exports = router

