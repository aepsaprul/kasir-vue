const db = require('../config/db');

exports.getHistory = async (req, res) => {
    try {
        // 1. Ambil Data Header Penjualan (Join User & Customer)
        const queryHeader = `
            SELECT s.*, u.name as cashier_name, c.name as customer_name
            FROM sales s
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN customers c ON s.customer_id = c.id
            ORDER BY s.created_at DESC
        `;
        const [sales] = await db.query(queryHeader);

        // 2. Ambil Data Item Penjualan (Join Product)
        const queryItems = `
            SELECT si.*, p.name as product_name, p.code, cat.name as category_name
            FROM sale_items si
            JOIN products p ON si.product_id = p.id
            LEFT JOIN categories cat ON p.category_id = cat.id
            ORDER BY si.id ASC
        `;
        const [items] = await db.query(queryItems);

        // 3. Gabungkan (Mapping) Item ke dalam Header Penjualan
        const results = sales.map(sale => {
            return {
                ...sale,
                items: items.filter(item => item.sale_id === sale.id)
            };
        });

        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.createSale = async (req, res) => {
    // Data dari Frontend: customer_id (opsional), items (array produk), paid_amount (bayar)
    const { customer_id, items, paid_amount, payment_method } = req.body; 
    const userId = req.user.id; // Diambil dari token login

    // Buat Nomor Invoice Otomatis (Format: INV-TIMESTAMP)
    const invoiceNo = `INV-${Date.now()}`;
    
    // Hitung Total Belanja di Backend (Biar aman, jangan percaya 100% data harga dari frontend)
    let totalAmount = 0;

    // Mulai Database Transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Validasi Stok & Hitung Total
        for (const item of items) {
            const [product] = await connection.query('SELECT price_sell, stock FROM products WHERE id = ?', [item.id]);
            
            if (product.length === 0) {
                throw new Error(`Produk ID ${item.id} tidak ditemukan`);
            }
            if (product[0].stock < item.qty) {
                throw new Error(`Stok tidak cukup untuk produk ID ${item.id}`);
            }

            // Gunakan harga dari database agar tidak dimanipulasi
            item.price = product[0].price_sell; 
            item.subtotal = item.price * item.qty;
            totalAmount += item.subtotal;
        }

        // 2. Simpan Header Transaksi (Tabel sales)
        const changeAmount = paid_amount - totalAmount;
        if (changeAmount < 0) throw new Error('Uang pembayaran kurang!');

        const [saleResult] = await connection.query(
            `INSERT INTO sales (invoice_no, user_id, customer_id, total_amount, final_amount, paid_amount, change_amount, payment_method) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [invoiceNo, userId, customer_id || null, totalAmount, totalAmount, paid_amount, changeAmount, payment_method || 'Tunai']
        );

        const saleId = saleResult.insertId;

        // 3. Simpan Detail Item & Update Stok
        for (const item of items) {
            // Insert ke sale_items
            await connection.query(
                `INSERT INTO sale_items (sale_id, product_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)`,
                [saleId, item.id, item.qty, item.price, item.subtotal]
            );

            // Update Stok Produk (Kurangi)
            await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.qty, item.id]
            );
        }

        // Jika semua lancar, COMMIT (Simpan permanen)
        await connection.commit();

        res.status(201).json({
            message: 'Transaksi berhasil',
            invoice: invoiceNo,
            change: changeAmount
        });

    } catch (error) {
        // Jika ada error, ROLLBACK (Batalkan semua perubahan)
        await connection.rollback();
        console.error(error);
        res.status(400).json({ message: error.message });
    } finally {
        connection.release();
    }
};