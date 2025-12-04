const express = require('express');
const router = express.Router();
const controller = require('../controllers/settingController');
const multer = require('multer');
const path = require('path');

// Config Multer (Sama seperti Profile)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, 'logo-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes (Tanpa Auth Middleware untuk GET agar login page bisa akses, tapi PUT harus login)
// Namun untuk keamanan, GET kita buka publik, PUT kita kunci.
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', controller.getSettings);
router.put('/', authMiddleware, upload.single('logo'), controller.updateSettings);

module.exports = router;