const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authMiddleware = require('../middleware/authMiddleware');

// Pasang middleware di semua route kategori
router.use(authMiddleware);

router.get('/', unitController.getAll);
router.post('/', unitController.create);
router.put('/:id', unitController.update);
router.delete('/:id', unitController.delete);

module.exports = router;