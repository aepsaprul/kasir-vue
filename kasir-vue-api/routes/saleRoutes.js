const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', saleController.getHistory);
router.post('/', saleController.createSale);

module.exports = router;