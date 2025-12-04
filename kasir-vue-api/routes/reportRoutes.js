const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/reports/dashboard
router.get('/dashboard', controller.getSummary);

module.exports = router;