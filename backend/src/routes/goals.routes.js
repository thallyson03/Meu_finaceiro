const express = require('express')
const router = express.Router()
const goalsController = require('../controllers/goals.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Todas as rotas requerem autenticação
router.use(authMiddleware)

// CRUD de metas
router.get('/', goalsController.getGoals)
router.post('/', goalsController.createGoal)
router.put('/:id', goalsController.updateGoal)
router.delete('/:id', goalsController.deleteGoal)

// Adicionar valor à meta
router.post('/:id/add', goalsController.addToGoal)

module.exports = router

