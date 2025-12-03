const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

// Rota temporária - receitas agora são tratadas como transações type="income"
router.use(auth);

router.get('/', (req, res) => {
  res.json({ message: 'Use /api/transactions com type=income' });
});

module.exports = router;
