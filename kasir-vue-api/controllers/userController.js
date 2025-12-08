const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET ALL USERS (Join Role Name)
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id, u.name, u.email, u.role_id, u.avatar, r.name as role_name 
            FROM users u JOIN roles r ON u.role_id = r.id
        `);
        res.json(rows);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// CREATE USER
exports.create = async (req, res) => {
    const { name, email, password, role_id } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)', 
            [name, email, hash, role_id]);
        res.status(201).json({ message: 'User berhasil dibuat' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// UPDATE USER
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role_id } = req.body;
    try {
        let query = 'UPDATE users SET name=?, email=?, role_id=?';
        let params = [name, email, role_id];

        if(password) { // Jika password diisi, update password
            const hash = await bcrypt.hash(password, 10);
            query += ', password=?';
            params.push(hash);
        }
        
        query += ' WHERE id=?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: 'User berhasil diupdate' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// DELETE USER
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id=?', [id]);
        res.json({ message: 'User dihapus' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};