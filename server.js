const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs'); // bcryptjs kullandığımızdan emin olalım
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Statik dosyaları (index.html, script.js, style.css vb.) dışarıya aç
app.use(express.static(__dirname));

// 1. Veri Tabanını Başlat
const db = new sqlite3.Database('./veritabani.db', (err) => {
    if (err) console.error('DB Bağlantı Hatası:', err.message);
    else console.log('SQLite Veri Tabanına Bağlanıldı.');
});

// 2. Kullanıcılar Tablosunu Oluştur
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// --- KAYIT OL ENDPOINT'İ ---
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        // Şifreyi güvenli şekilde şifrele (Hash)
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ success: false, message: 'Bu e-posta adresi zaten kayıtlı!' });
                }
                return res.status(500).json({ success: false, message: 'Veri tabanı hatası.' });
            }
            res.json({ success: true, message: 'Kayıt başarıyla tamamlandı!' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
    }
});

// --- GİRİŞ YAP ENDPOINT'İ ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ success: false, message: 'Veri tabanı hatası.' });
        if (!user) return res.status(400).json({ success: false, message: 'Kullanıcı bulunamadı!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json({ 
                success: true, 
                message: 'Giriş başarılı!', 
                user: { name: user.name, email: user.email } 
            });
        } else {
            res.status(400).json({ success: false, message: 'Hatalı şifre!' });
        }
    });
});
// ŞİFRE SIFIRLAMA ENDPOINT'İ
app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: 'E-posta ve yeni şifre gereklidir.' });
    }

    // Kullanıcı var mı kontrol et ve şifresini güncelle
    const sql = `UPDATE users SET password = ? WHERE email = ?`;
    db.run(sql, [newPassword, email], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Veritabanı hatası.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Bu e-posta adresine ait kullanıcı bulunamadı.' });
        }

        return res.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
    });
});

// Sunucuyu Başlat
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu hazır! http://localhost:${PORT} adresinden erişebilirsin.`);
});