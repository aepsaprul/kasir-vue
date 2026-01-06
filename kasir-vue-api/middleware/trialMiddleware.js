const db = require('../config/db');

module.exports = async (req, res, next) => {
    // Pastikan user sudah login (middleware auth harus jalan duluan)
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userId = req.user.id;
        // Cek data trial user
        const [rows] = await db.query('SELECT trial_ends_at, is_subscribed FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        const user = rows[0];
        const now = new Date();
        const trialEnd = new Date(user.trial_ends_at);

        // LOGIKA UTAMA: Jika tidak langganan DAN waktu sekarang > batas trial
        if (!user.is_subscribed && now > trialEnd) {
            return res.status(403).json({ 
                message: "Masa trial aplikasi telah habis.",
                code: "TRIAL_EXPIRED", // Kode khusus untuk dibaca Frontend
                trial_expired: true 
            });
        }

        next(); // Lanjut jika aman

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Gagal cek status trial' });
    }
};