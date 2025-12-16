const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/', transactionsController.list);
router.post('/', transactionsController.create);
router.get('/summary', transactionsController.summary);
router.delete('/:id', transactionsController.delete);
router.post('/:id/pay', transactionsController.pay); // Pagar despesa
router.post('/:id/receive', transactionsController.receive); // Receber receita

module.exports = router;
