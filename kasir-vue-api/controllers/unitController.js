const db = require('../config/db');

// TAMPILKAN SEMUA DATA
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM units ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TAMBAH DATA BARU
exports.create = async (req, res) => {
    const { name } = req.body;
    try {
        await db.query('INSERT INTO units (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Unit berhasil dibuat' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE DATA
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await db.query('UPDATE units SET name = ? WHERE id = ?', [name, id]);
        res.json({ message: 'Unit berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// HAPUS DATA
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM units WHERE id = ?', [id]);
        res.json({ message: 'Unit berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};