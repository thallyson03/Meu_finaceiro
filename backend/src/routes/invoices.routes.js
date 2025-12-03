const express = require('express');
const multer = require('multer');
const router = express.Router();
const invoicesController = require('../controllers/invoices.controller');
const auth = require('../middlewares/auth.middleware');

const upload = multer({ dest: 'uploads/' });
router.post('/upload', auth, upload.single('file'), invoicesController.upload);

module.exports = router;
