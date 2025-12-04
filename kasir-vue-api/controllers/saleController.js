const db = require('../config/db');

exports.createSale = async (req, res) => {
    // Data dari Frontend: customer_id (opsional), items (array produk), paid_amount (bayar)
    const { customer_id, items, paid_amount } = req.body; 
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
            `INSERT INTO sales (invoice_no, user_id, customer_id, total_amount, final_amount, paid_amount, change_amount) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [invoiceNo, userId, customer_id || null, totalAmount, totalAmount, paid_amount, changeAmount]
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