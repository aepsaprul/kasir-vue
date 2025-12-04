const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', controller.createPurchase);

module.exports = router;