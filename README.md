# 📱 Dumansız Gelecek - APK Uygulaması

TEKNOFEST 2026 projesi - Sigara bırakma yardımcı uygulaması.

---

## 🚀 APK Oluşturma (Otomatik - GitHub Actions)

### KOLAY YONTEM ✅ - Bilgisayarında kurulum YOK!

1. **GitHub'a Push Et**
   ```bash
   git add .
   git commit -m "Dumansız Gelecek APK"
   git push
   ```

2. **GitHub Actions Otomatik Çalışır** 🤖
   - Repo settings → Actions → enable
   - Push'ladığında otomatik build başlar

3. **APK İndir**
   - GitHub Repo → Actions tab
   - Son build → Artifacts
   - `debug-apk` → `app-debug.apk` İNDİR

4. **Cihaza Yükle**
   - APK dosyasını Android'e gönder
   - "Bilinmeyen Kaynaktan Yüklemeye İzin Ver" açılacak
   - Tapped × kurulur ✨

---

## 📁 Dosya Yapısı

```
Nova-Aİ/
├── main.py               # Android WebView wrapper
├── requirements.txt      # Bağımlılıklar (pyjnius, android)
├── buildozer.spec        # Android build config
├── .github/workflows/
│   └── build.yml         # GitHub Actions automation
├── .gitignore            # Git ignore rules
└── README.md             # Bu dosya
```

---

## 🔧 Manual APK Build (Opsiyonel)

Eğer kendi bilgisayarında build etmek istersen:

### Linux / Mac:
```bash
# Gerekli paketler
sudo apt-get install -y build-essential openjdk-17-jdk android-sdk cython

# Buildozer yükle
pip install buildozer

# APK build
buildozer android debug
```

### Windows:
Kolay değil. GitHub Actions kullanmasını tavsiye ederiz.

---

## 📱 Uygulama Özellikleri

- ✅ WebView tabanlı (hafif, hızlı)
- ✅ TEKNOFEST sitesini gösterir
- ✅ Tüm özellikler çalışır (panel, simülasyon, vb)
- ✅ İnternet bağlantısı gerekli
- ✅ Tema değiştirme destekleniyor

---

## 🔗 Kaynaklar

- Buildozer: https://buildozer.readthedocs.io/
- Python-for-Android: https://python-for-android.readthedocs.io/
- Pyjnius: https://pyjnius.readthedocs.io/

---

## 📞 Sorun?

Hata alırsan screenshot'ını paylaş ve çözeceğiz! 🔧
