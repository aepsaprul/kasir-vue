const db = require('../config/db');

exports.getSummary = async (req, res) => {
    // Ambil parameter tanggal dari frontend (start_date & end_date)
    // Jika kosong, default ke bulan ini
    const startDate = req.query.start_date || new Date().toISOString().slice(0, 8) + '01'; 
    const endDate = req.query.end_date || new Date().toISOString().slice(0, 10);

    try {
        // 1. Hitung Total Penjualan (Omset)
        const [salesRes] = await db.query(
            `SELECT SUM(final_amount) as total FROM sales 
             WHERE DATE(created_at) BETWEEN ? AND ?`, 
            [startDate, endDate]
        );
        const totalSales = salesRes[0].total || 0;

        // 2. Hitung Total Pembelian (Pengeluaran Stok)
        const [purchasesRes] = await db.query(
            `SELECT SUM(total_amount) as total FROM purchases 
             WHERE DATE(created_at) BETWEEN ? AND ?`, 
            [startDate, endDate]
        );
        const totalPurchases = purchasesRes[0].total || 0;

        // 3. Hitung Laba Kotor (Profit)
        // Rumus: (Harga Jual di Transaksi - Harga Beli di Master Produk) * Qty
        // Catatan: Ini estimasi laba berdasarkan harga beli saat ini.
        const queryProfit = `
            SELECT SUM((si.price - p.price_buy) * si.qty) as profit
            FROM sale_items si
            JOIN sales s ON si.sale_id = s.id
            JOIN products p ON si.product_id = p.id
            WHERE DATE(s.created_at) BETWEEN ? AND ?
        `;
        const [profitRes] = await db.query(queryProfit, [startDate, endDate]);
        const grossProfit = profitRes[0].profit || 0;

        // 4. Ambil 5 Transaksi Terakhir (Untuk ditampilkan di dashboard)
        const [recentSales] = await db.query(
            `SELECT s.invoice_no, s.created_at, s.final_amount, u.name as cashier_name 
             FROM sales s 
             JOIN users u ON s.user_id = u.id 
             ORDER BY s.created_at DESC LIMIT 5`
        );

        res.json({
            period: { startDate, endDate },
            summary: {
                sales: totalSales,
                purchases: totalPurchases,
                profit: grossProfit,
                cash_flow: totalSales - totalPurchases // Cash Flow sederhana
            },
            recent_sales: recentSales
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};