const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', controller.getDashboardData);

module.exports = router;