const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/', transactionsController.list);
router.post('/', transactionsController.create);
router.get('/summary', transactionsController.summary);

module.exports = router;
