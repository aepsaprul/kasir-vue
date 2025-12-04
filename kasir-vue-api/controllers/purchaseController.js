const db = require('../config/db');

exports.getHistory = async (req, res) => {
    try {
        // 1. Ambil Header Pembelian (Join User & Supplier)
        const queryHeader = `
            SELECT p.*, u.name as admin_name, s.name as supplier_name
            FROM purchases p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.created_at DESC
        `;
        const [purchases] = await db.query(queryHeader);

        // 2. Ambil Item Pembelian
        const queryItems = `
            SELECT pi.*, p.name as product_name, p.code
            FROM purchase_items pi
            JOIN products p ON pi.product_id = p.id
            ORDER BY pi.id ASC
        `;
        const [items] = await db.query(queryItems);

        // 3. Gabungkan
        const results = purchases.map(pur => {
            return {
                ...pur,
                items: items.filter(item => item.purchase_id === pur.id)
            };
        });

        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.createPurchase = async (req, res) => {
    // Data: supplier_id, invoice_no (dari nota supplier), items
    const { supplier_id, invoice_no, items } = req.body;
    const userId = req.user.id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        let totalAmount = 0;

        // 1. Hitung Total
        items.forEach(item => {
            totalAmount += item.price_buy * item.qty;
        });

        // 2. Simpan Header Pembelian
        // Jika user tidak isi invoice_no, kita generate otomatis
        const finalInvoice = invoice_no || `BUY-${Date.now()}`;

        const [resHeader] = await connection.query(
            `INSERT INTO purchases (invoice_no, supplier_id, user_id, total_amount) VALUES (?, ?, ?, ?)`,
            [finalInvoice, supplier_id, userId, totalAmount]
        );
        const purchaseId = resHeader.insertId;

        // 3. Simpan Detail & Update Stok Master
        for (const item of items) {
            // Insert history item
            await connection.query(
                `INSERT INTO purchase_items (purchase_id, product_id, qty, price_buy, subtotal) VALUES (?, ?, ?, ?, ?)`,
                [purchaseId, item.id, item.qty, item.price_buy, (item.price_buy * item.qty)]
            );

            // PENTING: Update Stok (+Qty) DAN Update Harga Beli Terbaru di Master Produk
            // Kita asumsikan harga beli terbaru adalah harga yang berlaku sekarang
            await connection.query(
                `UPDATE products SET stock = stock + ?, price_buy = ? WHERE id = ?`,
                [item.qty, item.price_buy, item.id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Pembelian berhasil disimpan' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Gagal memproses pembelian' });
    } finally {
        connection.release();
    }
};