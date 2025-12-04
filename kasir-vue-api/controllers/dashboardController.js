const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

        // 1. KARTU STATISTIK
        // Penjualan Hari Ini
        const [todayRes] = await db.query(
            `SELECT SUM(final_amount) as total FROM sales WHERE DATE(created_at) = ?`, [today]
        );
        
        // Penjualan Bulan Ini
        const [monthRes] = await db.query(
            `SELECT SUM(final_amount) as total FROM sales WHERE DATE(created_at) >= ?`, [startOfMonth]
        );

        // Total Produk
        const [prodRes] = await db.query(`SELECT COUNT(*) as total FROM products`);

        // Total Pelanggan
        const [custRes] = await db.query(`SELECT COUNT(*) as total FROM customers`);

        // 2. ALERT STOK MENIPIS (Stok <= 5)
        const [lowStock] = await db.query(
            `SELECT name, stock, min_stock FROM products WHERE stock <= min_stock ORDER BY stock ASC LIMIT 5`
        );

        // 3. TRANSAKSI TERAKHIR (5 Data)
        const [recentSales] = await db.query(
            `SELECT s.invoice_no, s.final_amount, s.created_at, u.name as cashier 
            FROM sales s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC LIMIT 5`
        );

        // 4. DATA GRAFIK (7 Hari Terakhir)
        const [chartData] = await db.query(`
            SELECT DATE(created_at) as date, SUM(final_amount) as total
            FROM sales
            WHERE created_at >= DATE(NOW()) - INTERVAL 7 DAY
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        res.json({
            stats: {
                today_sales: todayRes[0].total || 0,
                month_sales: monthRes[0].total || 0,
                total_products: prodRes[0].total || 0,
                total_customers: custRes[0].total || 0
            },
            low_stock: lowStock,
            recent_sales: recentSales,
            chart: chartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};