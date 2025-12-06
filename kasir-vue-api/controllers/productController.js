const db = require('../config/db');
const fs = require('fs');
const path = require('path');

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
        price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, min_stock 
    } = req.body;

    // Ambil nama file jika ada upload
    const image = req.file ? req.file.filename : null;

    try {
        const [existing] = await db.query('SELECT id FROM products WHERE code = ?', [code]);
        if (existing.length > 0) return res.status(400).json({ message: 'Kode barang sudah ada!' });

        const query = `
            INSERT INTO products 
            (code, name, category_id, unit_id, price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, min_stock, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [
            code, name, category_id, unit_id, 
            price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, min_stock || 5, 
            image
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
        price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, min_stock 
    } = req.body;

    try {
        let sql = `
            UPDATE products SET 
            code=?, name=?, category_id=?, unit_id=?, 
            price_buy=?, price_sell=?, price_wholesale=?, min_wholesale_qty=?, stock=?, min_stock=?
        `;
        let params = [
            code, name, category_id, unit_id, 
            price_buy, price_sell, price_wholesale, min_wholesale_qty, stock, min_stock
        ];

        // Jika ada upload gambar baru
        if (req.file) {
            // 1. Hapus gambar lama
            const [rows] = await db.query('SELECT image FROM products WHERE id = ?', [id]);
            if (rows[0] && rows[0].image) {
                const oldPath = path.join(__dirname, '../uploads', rows[0].image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // 2. Tambahkan ke query update
            sql += `, image=?`;
            params.push(req.file.filename);
        }

        sql += ` WHERE id=?`;
        params.push(id);

        await db.query(sql, params);
        res.json({ message: 'Produk berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// HAPUS PRODUK
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        // Cek apakah produk ada
        const [rows] = await db.query('SELECT image FROM products WHERE id = ?', [id]);
        if (!rows.length) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        const imageName = rows[0].image;

        // --- HAPUS DATA DI DATABASE DULU ---
        try {
            await db.query('DELETE FROM products WHERE id = ?', [id]);
        } catch (dbError) {
            // Jika gagal karena relational constraint
            return res.status(400).json({
                message: 'Produk tidak bisa dihapus karena sedang digunakan di tabel lain.'
            });
        }

        // --- BARU HAPUS FILE GAMBAR ---
        if (imageName) {
            const imagePath = path.join(__dirname, '../uploads', imageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};