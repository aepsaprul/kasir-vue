const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockOpnameController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', controller.getHistory);
router.post('/', controller.createAdjustment);

module.exports = router;