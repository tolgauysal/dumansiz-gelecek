/**
 * ============================================================================
 * PROJE: Dumansız Gelecek (TEKNOFEST 2027 / Sağlık ve İlk Yardım Kategorisi)
 * DOSYA: server.js (Ana Sunucu ve API Yönetim Katmanı)
 * AÇIKLAMA: Express tabanlı, güvenlik ve loglama
 *           altyapısına sahip backend sunucu yazılımı.
 * ============================================================================
 */

'use strict';

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");


// ============================================================================
// 1. UYGULAMA VE ORTAM YAPILANDIRMASI
// ============================================================================

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
app.set("trust proxy", 1);
app.disable("x-powered-by");

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Çok fazla istek gönderildi. Lütfen kısa süre sonra tekrar deneyin."
    }
});

const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Yapay zeka servisleri için istek limiti aşıldı. Bir dakika sonra tekrar deneyin."
    }
});

const maliciousRequestGuard = (req, res, next) => {
    const rawUrl = req.originalUrl || "";
    const host = req.get("host") || "";
    const suspiciousUrlPattern = /(?:\.\.[\\/]|%2e%2e|%2f|%5c|(?:\\x00)|(?:\\0))/i;

    if (suspiciousUrlPattern.test(rawUrl) || rawUrl.includes("..") || rawUrl.includes("\\")) {
        return res.status(400).json({
            success: false,
            error: "Geçersiz istek yapısı tespit edildi."
        });
    }

    if (host.includes("\n") || host.includes("\r") || host.includes(" ")) {
        return res.status(400).json({
            success: false,
            error: "Geçersiz host başlığı."
        });
    }

    next();
};

// ============================================================================
// 2. ÖZEL MIDDLEWARE KATMANLARI (GÜVENLİK, LOGLAMA VE PERFORMANS)
// ============================================================================

/**
 * Gelen tüm HTTP isteklerini konsola ve log dosyasına kaydeden middleware
 */
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${timestamp}] 🔍 ${method} İsteği: ${url} - IP: ${ip}`);
    
    // Basit bir dosya tabanlı loglama simülasyonu
    try {
        const logEntry = `[${timestamp}] ${method} ${url} - ${ip}\n`;
        const logDir = path.join(__dirname, "logs");
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(path.join(logDir, "access.log"), logEntry, "utf8");
    } catch (logErr) {
        // Log yazma hatası ana akışı durdurmasın
    }

    next();
};

// Global Middleware Tanımları
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://accounts.google.com",
                "https://cdn.jsdelivr.net",
                "https://formspree.io",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com",
                "https://tolgauysal.github.io",
                "https://cdn.jsdelivr.net",
                "https://formspree.io"
            ],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrcAttr: ["'unsafe-inline'"],
            fontSrc: [
                "'self'",
                "data:",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com"
            ],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: [
                "'self'",
                "https://generativelanguage.googleapis.com",
                "https://accounts.google.com",
                "https://formspree.io",
                "https://*.googleapis.com",
                "https://*.google.com",
                "https://tolgauysal.github.io"
            ],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'", "https://formspree.io"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "no-referrer" },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(generalLimiter);
app.use(maliciousRequestGuard);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
// ============================================================================
// 3. STATİK DOSYA VE KLASÖR YÖNLENDİRMELERİ
// ============================================================================

// Ana dizindeki varlıklar, stiller ve scriptler için kök erişim
app.use(express.static(path.join(__dirname)));

// Dokümantasyon klasörünün /docs üzerinden hatasız sunulması
app.use('/docs', express.static(path.join(__dirname, "docs")));

// Güvenli asset ve public paylaşımları
app.use('/assets', express.static(path.join(__dirname, "assets")));

// ============================================================================
// 4. WEB SAYFASI ROTALARI (VIEW ROUTING)
// ============================================================================

/**
 * Ana Sayfa Rota Yönetimi
 */
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("<h1>404 - Ana Sayfa (index.html) Bulunamadı!</h1>");
    }
});

/**
 * Sağlık Bilgi Portalı / Dokümantasyon Sayfası Yönlendirmesi
 */
app.get("/dokumanlar", (req, res) => {
    const docsPath = path.join(__dirname, "docs", "index.html");
    if (fs.existsSync(docsPath)) {
        res.sendFile(docsPath);
    } else {
        res.redirect("/docs/");
    }
});

/**
 * @route   GET /api/system-status
 * @desc    Sunucu sağlık durumunu, versiyonunu ve aktif servisleri raporlar.
 * @access  Public
 */
app.get("/api/system-status", (req, res) => {
    res.status(200).json({
        project: "Dumansız Gelecek",
        version: "2.2.0-TEKNOFEST",
        status: "Online",
        environment: NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage(),
        services: {
            server: "Running",
            database: "Local/JSON Storage Active"
        }
    });
});

// ============================================================================
// 6. 404 VE GLOBAL HATA YÖNETİMİ (ERROR HANDLING MIDDLEWARE)
// ============================================================================

// Tanımlı olmayan tüm rota istekleri için 404 Yakalayıcı
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: "Not Found",
        message: `Aradığınız '${req.originalUrl}' adresi bu sunucuda bulunamadı.`,
        suggestedDocs: "/docs/"
    });
});

// Genel Hata Yakalayıcı (Global Error Handler)
app.use((err, req, res, next) => {
    console.error("🔥 Beklenmeyen Sunucu Hatası:", err.stack || err);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: "Sunucu tarafında beklenmeyen bir hata oluştu.",
        details: NODE_ENV === "development" ? err.message : undefined
    });
});

// ============================================================================
// 7. SUNUCUYU BAŞLATMA (SERVER LISTEN)
// ============================================================================

const server = app.listen(PORT, () => {
    console.log("============================================================");
    console.log(" 🚭 PROJE: DUMANSIZ GELECEK - BACKEND SUNUCUSU AKTİF");
    console.log("============================================================");
    console.log(` 🌐 Yerel Erişim  : http://localhost:${PORT}`);
    console.log(` 📂 Dokümanlar    : http://localhost:${PORT}/docs/`);
    console.log(` ⚙️  Ortam Modu    : ${NODE_ENV.toUpperCase()}`);
    console.log(" 🛡️  Güvenlik Katmanları: Helmet + Rate Limiting + URL/Host Kontrol");
    console.log("============================================================");
});

server.keepAliveTimeout = 15000;
server.headersTimeout = 20000;