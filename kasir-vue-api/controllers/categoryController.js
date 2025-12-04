const db = require('../config/db');

// TAMPILKAN SEMUA DATA
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TAMBAH DATA BARU
exports.create = async (req, res) => {
    const { name } = req.body;
    try {
        await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Kategori berhasil dibuat' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE DATA
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
        res.json({ message: 'Kategori berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// HAPUS DATA
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};