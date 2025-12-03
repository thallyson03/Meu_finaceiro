const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/current', budgetController.getCurrentMonth);
router.post('/', budgetController.createOrUpdate);
router.delete('/:id', budgetController.delete);
router.get('/summary', budgetController.getFinancialSummary);

module.exports = router;
