const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password, remember_me } = req.body;

    try {
        // 1. Cari user berdasarkan email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Email tidak ditemukan' });
        }

        const user = rows[0];

        // 2. Cek apakah password cocok
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        const tokenDuration = remember_me ? '30d' : '1m';

        // 3. Buat Token (JWT)
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: tokenDuration } // Token berlaku 1 hari
        );

        // 4. Kirim respon sukses
        res.json({
            message: 'Login berhasil',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};