const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST transaksi baru
router.post('/', saleController.createSale);

module.exports = router;