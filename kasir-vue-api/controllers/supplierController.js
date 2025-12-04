const db = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM suppliers ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    const { name, phone, address } = req.body;
    try {
        await db.query('INSERT INTO suppliers (name, phone, address) VALUES (?, ?, ?)', [name, phone, address]);
        res.status(201).json({ message: 'Supplier berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;
    try {
        await db.query('UPDATE suppliers SET name=?, phone=?, address=? WHERE id=?', [name, phone, address, id]);
        res.json({ message: 'Supplier berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
        res.json({ message: 'Supplier berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};