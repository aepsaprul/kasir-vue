const db = require('./config/db');
const bcrypt = require('bcryptjs');

const updateAdmin = async () => {
    // Hash password "123456"
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Update ke database
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'admin@admin.com']);
    
    console.log('Password admin berhasil direset menjadi: 123456');
    process.exit();
};

updateAdmin();