const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer (Simpan di folder uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Nama file: avatar-USERID-TIMESTAMP.jpg
        cb(null, 'avatar-' + req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb('Error: File harus Gambar (jpeg/jpg/png)!');
    }
});

router.use(authMiddleware);

// Route Update Profil (Teks)
router.put('/', controller.updateProfile);

// Route Upload Avatar (File)
router.post('/avatar', upload.single('avatar'), controller.uploadAvatar);

module.exports = router;