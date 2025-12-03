const express = require('express');
const router = express.Router();
const installmentsController = require('../controllers/installments.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/', installmentsController.getAll);
router.get('/monthly-balance', installmentsController.getMonthlyBalance);
router.get('/future-projection', installmentsController.getFutureProjection);

module.exports = router;


