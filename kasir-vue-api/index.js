const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authMiddleware = require('./middleware/authMiddleware');
const trialMiddleware = require('./middleware/trialMiddleware');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const unitRoutes = require('./routes/unitRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const customerRoutes = require('./routes/customerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const stockOpnameRoutes = require('./routes/stockOpnameRoutes');
const profileRoutes = require('./routes/profileRoutes');
const settingRoutes = require('./routes/settingRoutes');
const rolesRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Agar VueJS bisa akses API ini
app.use(express.json()); // Agar bisa baca data JSON dari frontend

app.use('/api/auth', authRoutes);
app.use('/api/categories', authMiddleware, trialMiddleware, categoryRoutes);
app.use('/api/units', authMiddleware, trialMiddleware, unitRoutes);
app.use('/api/products', authMiddleware, trialMiddleware, productRoutes);
app.use('/api/sales', authMiddleware, trialMiddleware, saleRoutes);
app.use('/api/suppliers', authMiddleware, trialMiddleware, supplierRoutes);
app.use('/api/customers', authMiddleware, trialMiddleware, customerRoutes);
app.use('/api/purchases', authMiddleware, trialMiddleware, purchaseRoutes);
app.use('/api/reports', authMiddleware, trialMiddleware, reportRoutes);
app.use('/api/dashboard', authMiddleware, trialMiddleware, dashboardRoutes);
app.use('/api/stock-opname', authMiddleware, trialMiddleware, stockOpnameRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/profile', authMiddleware, trialMiddleware, profileRoutes);
app.use('/api/settings', authMiddleware, trialMiddleware, settingRoutes);
app.use('/api/roles', authMiddleware, trialMiddleware, rolesRoutes);
app.use('/api/users', authMiddleware, trialMiddleware, userRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('API Kasir Ready!');
});

// Jalankan Server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});