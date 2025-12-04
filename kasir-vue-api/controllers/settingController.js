const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// AMBIL DATA SETTING
exports.getSettings = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM settings WHERE id = 1');
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE DATA SETTING
exports.updateSettings = async (req, res) => {
    const { store_name, email, phone, address } = req.body;
    
    try {
        // Cek apakah ada upload logo baru
        let logoQueryPart = '';
        let params = [store_name, email, phone, address];

        if (req.file) {
            // Hapus logo lama jika ada
            const [rows] = await db.query('SELECT logo FROM settings WHERE id = 1');
            if (rows[0].logo) {
                const oldPath = path.join(__dirname, '../uploads', rows[0].logo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            
            logoQueryPart = ', logo = ?';
            params.push(req.file.filename);
        }

        params.push(1); // ID = 1

        const query = `UPDATE settings SET store_name=?, email=?, phone=?, address=? ${logoQueryPart} WHERE id=?`;
        
        await db.query(query, params);
        
        res.json({ message: 'Pengaturan berhasil disimpan' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menyimpan pengaturan' });
    }
};