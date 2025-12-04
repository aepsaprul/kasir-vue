const db = require('../config/db');

// TAMPILKAN SEMUA PRODUK (Dengan Nama Kategori & Satuan)
exports.getAll = async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as category_name, u.name as unit_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
            ORDER BY p.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AMBIL SATU PRODUK (Untuk Edit/Detail)
exports.getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TAMBAH PRODUK
exports.create = async (req, res) => {
    const { 
        code, name, category_id, unit_id, 
        price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, 
        min_stock
    } = req.body;

    try {
        // Cek kode unik
        const [existing] = await db.query('SELECT id FROM products WHERE code = ?', [code]);
        if (existing.length > 0) return res.status(400).json({ message: 'Kode barang sudah ada!' });

        const query = `
            INSERT INTO products 
            (code, name, category_id, unit_id, price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, min_stock) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [
            code, name, category_id, unit_id, 
            price_buy, price_sell, price_wholesale, min_wholesale_qty, stock,
            min_stock || 5
        ]);
        
        res.status(201).json({ message: 'Produk berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUK
exports.update = async (req, res) => {
    const { id } = req.params;
    const { 
        code, name, category_id, unit_id, 
        price_buy, price_sell, price_wholesale, min_wholesale_qty, stock,
        min_stock
    } = req.body;

    try {
        const query = `
            UPDATE products SET 
            code=?, name=?, category_id=?, unit_id=?, 
            price_buy=?, price_sell=?, price_wholesale=?, min_wholesale_qty=?, stock=?, min_stock=?
            WHERE id=?
        `;
        await db.query(query, [
            code, name, category_id, unit_id, 
            price_buy, price_sell, price_wholesale, min_wholesale_qty, stock,
            min_stock || 5, id
        ]);
        res.json({ message: 'Produk berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// HAPUS PRODUK
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Biasanya gagal kalau produk sudah pernah dipake transaksi
    }
};