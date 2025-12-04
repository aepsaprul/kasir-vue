const db = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// UPDATE INFO UMUM & PASSWORD
exports.updateProfile = async (req, res) => {
    const { name, email, password, new_password } = req.body;
    const userId = req.user.id;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = users[0];

        // 1. Update Password (Jika diisi)
        let finalPassword = user.password;
        if (password && new_password) {
            // Cek password lama
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Password lama salah!' });
            
            // Hash password baru
            finalPassword = await bcrypt.hash(new_password, 10);
        }

        // 2. Update Database
        await db.query(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, finalPassword, userId]
        );

        // 3. Kirim data user terbaru (tanpa password)
        const updatedUser = { ...user, name, email, password: '' };
        res.json({ 
            message: 'Profil berhasil diupdate',
            user: updatedUser 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal update profil' });
    }
};

// UPLOAD AVATAR
exports.uploadAvatar = async (req, res) => {
    const userId = req.user.id;
    
    if (!req.file) {
        return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    try {
        // Hapus avatar lama jika ada (opsional, biar hemat storage)
        const [users] = await db.query('SELECT avatar FROM users WHERE id = ?', [userId]);
        const oldAvatar = users[0].avatar;
        
        if (oldAvatar) {
            const oldPath = path.join(__dirname, '../uploads', oldAvatar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Simpan nama file baru ke database
        const filename = req.file.filename;
        await db.query('UPDATE users SET avatar = ? WHERE id = ?', [filename, userId]);

        res.json({ 
            message: 'Avatar berhasil diubah', 
            avatar_url: filename 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal upload avatar' });
    }
};