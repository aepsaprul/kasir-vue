const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Ambil token dari header (Format: "Bearer <token>")
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader) {
        return res.status(401).json({ message: 'Akses ditolak, token tidak ada' });
    }

    try {
        const token = tokenHeader.split(' ')[1]; // Ambil tokennya saja tanpa kata "Bearer"
        
        // 2. Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Simpan data user ke request agar bisa dipakai di controller
        req.user = decoded;
        next(); // Lanjut ke proses berikutnya
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};