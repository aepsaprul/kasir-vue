const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // Nama file: product-TIMESTAMP.jpg
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.use(authMiddleware);

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', upload.single('image'), productController.create);
router.put('/:id', upload.single('image'), productController.update);
// router.post('/', productController.create);
// router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;