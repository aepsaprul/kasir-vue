const db = require('../config/db');

// GET Riwayat Stok Opname
exports.getHistory = async (req, res) => {
    try {
        const query = `
            SELECT sa.*, p.name as product_name, p.code, u.name as admin_name
            FROM stock_adjustments sa
            JOIN products p ON sa.product_id = p.id
            JOIN users u ON sa.user_id = u.id
            ORDER BY sa.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST Proses Stok Opname
exports.createAdjustment = async (req, res) => {
    const { product_id, real_stock, note } = req.body;
    const userId = req.user.id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Ambil Stok Sistem Terbaru (Biar akurat saat detik ini)
        const [prod] = await connection.query('SELECT stock FROM products WHERE id = ?', [product_id]);
        
        if (prod.length === 0) {
            throw new Error('Produk tidak ditemukan');
        }

        const systemStock = prod[0].stock;
        const difference = real_stock - systemStock;

        // 2. Simpan Riwayat Penyesuaian
        await connection.query(
            `INSERT INTO stock_adjustments (product_id, user_id, system_stock, real_stock, difference, note) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [product_id, userId, systemStock, real_stock, difference, note]
        );

        // 3. Update Stok Master Produk dengan Stok Nyata (Real Stock)
        await connection.query(
            `UPDATE products SET stock = ? WHERE id = ?`,
            [real_stock, product_id]
        );

        await connection.commit();
        res.json({ message: 'Stok berhasil disesuaikan' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Gagal melakukan stok opname' });
    } finally {
        connection.release();
    }
};