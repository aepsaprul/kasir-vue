const db = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles');
        // Parsing JSON access_menu dari string ke array
        const results = rows.map(r => ({ ...r, access_menu: JSON.parse(r.access_menu || '[]') }));
        res.json(results);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.create = async (req, res) => {
    const { name, access_menu } = req.body;
    try {
        // Simpan array menu sebagai JSON String
        const menuString = JSON.stringify(access_menu);
        await db.query('INSERT INTO roles (name, access_menu) VALUES (?, ?)', [name, menuString]);
        res.status(201).json({ message: 'Role berhasil dibuat' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, access_menu } = req.body;
    try {
        const menuString = JSON.stringify(access_menu);
        await db.query('UPDATE roles SET name=?, access_menu=? WHERE id=?', [name, menuString, id]);
        res.json({ message: 'Role berhasil diupdate' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        // Cek apakah ada user yg pakai role ini
        const [users] = await db.query('SELECT id FROM users WHERE role_id = ?', [id]);
        if(users.length > 0) return res.status(400).json({message: 'Role sedang dipakai user, tidak bisa dihapus'});

        await db.query('DELETE FROM roles WHERE id = ?', [id]);
        res.json({ message: 'Role dihapus' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};