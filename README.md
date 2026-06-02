# 📱 Dumansız Gelecek - Android Uygulaması

**Dumansız Gelecek web uygulamasını Android telefonunuzda kullanın!**

Bu proje Python kodunu Kivy + Buildozer kullanarak Android APK uygulamasına dönüştürür.

---

## 📥 APK İNDİR

### ⭐ Seçenek 1: Web Sitesinden (Önerilen)
👉 **[dumansiz-gelecek.github.io](https://tolgauysal.github.io/dumansiz-gelecek/)**
- Responsive tasarım
- Kurulum talimatları
- 1-tıkla indir

### Seçenek 2: GitHub Releases
👉 **[GitHub Releases](https://github.com/tolgauysal/dumansiz-gelecek/releases)**
- En son sürümler
- Detaylı changelog
- Tüm versiyonlar

### Seçenek 3: GitHub Actions (Latest Build)
1. Repo → **Actions** tab
2. Son **"Build APK"** workflow'u aç
3. **Artifacts** → `dumansizelecek-apk` indir

---

## ✨ Uygulamanın Özellikleri

✅ **WebView Tabanlı** - Hafif ve hızlı  
✅ **Responsive Tasarım** - Tüm ekran boyutlarında çalışır  
✅ **Kivy Framework** - Python → Android otomatik derleme  
✅ **İnternet Gerekli** - Web sitesine erişim için  
✅ **Portrait Mode** - Mobil optimized  
✅ **Tüm Android Cihazlar** - Min API 21 (Android 5.0+)  
✅ **Hafif** - ~50 MB boyutunda  
✅ **Hızlı** - WebView performansı  

---

## 📋 Sistem Gereksinimleri

### Android Cihaz:
- **Min API**: 21 (Android 5.0 Lollipop)
- **Target API**: 31 (Android 12)
- **RAM**: 256 MB minimum
- **Depolama**: ~60 MB
- **İnternet**: Gerekli ✅

### Bilgisayar (Derleme İçin - Opsiyonel):
- Python 3.8+
- Java JDK 11+
- Android SDK + NDK
- Gradle

---

## 🚀 Kurulum (Telefonda)

### Adım 1: APK İndir
Yukarıdaki bağlantılardan birini kullanarak APK dosyasını indir

### Adım 2: Bilinmeyen Kaynaktan Yüklemeye İzin Ver
```
Ayarlar → Güvenlik → "Bilinmeyen Kaynaktan Yükleme" → AÇ
```

### Adım 3: APK'yı Yükle
1. APK dosyasını aç
2. "Yükle" tıkla
3. Kurulumu bekle

### Adım 4: Uygulamayı Başlat
"Dumansız Gelecek" uygulamasını bul ve tıkla ✨

---

## 🔧 GitHub Actions İle APK Oluşturma (Otomatik)

### Trigger Olayları
- Push → `main` branch'e
- Pull Request → `main` branch'e
- Tag oluşturma → `v*` (Release oluşturur)

### Workflow Adımları
1. ✅ Ubuntu 22.04 başlatır
2. ✅ Python 3.11 yükler
3. ✅ Android SDK + NDK kurar
4. ✅ Kivy + Buildozer yükler
5. ✅ APK derler
6. ✅ Artifacts'a yükler
7. ✅ Release oluşturur (tag varsa)

### Push Etmek İçin:
```bash
git add .
git commit -m "Dumansız Gelecek güncelleme"
git push origin main
```

### Release Oluşturmak İçin (Sürüm Etiketiyle):
```bash
git tag v1.0.1
git push origin v1.0.1
```

---

## 📁 Dosya Yapısı

```
dumansiz-gelecek/
├── main.py                  # Ana Kivy uygulaması
├── buildozer.spec           # Android derleme config
├── requirements.txt         # Python bağımlılıkları
├── pyproject.toml           # BeeWare config (opsiyonel)
├── docs/
│   └── index.html           # Web sitesi + APK indir (GitHub Pages)
├── src/
│   └── dumansizelecek/
│       ├── __init__.py
│       └── app.py           # BeeWare app config
├── .github/
│   └── workflows/
│       └── build.yml        # GitHub Actions CI/CD
├── bin/                     # Derlenmiş APK'lar (lokal)
├── .gitignore               # Git ignore rules
└── README.md                # Bu dosya
```

---

## 🌐 Web Sitesi (GitHub Pages)

**URL**: https://tolgauysal.github.io/dumansiz-gelecek/

Özellikler:
- 📥 APK indir butonu
- 📖 Kurulum talimatları
- ✨ Uygulamanın özellikleri
- 📱 Responsive tasarım
- 🎨 Modern UI

---

## 💻 Manuel APK Build (Opsiyonel)

### Linux / macOS:
```bash
# Gerekli paketler
sudo apt-get install -y build-essential openjdk-17-jdk cython python3-dev

# Buildozer + Kivy yükle
pip install buildozer kivy

# Repository'yi klonla
git clone https://github.com/tolgauysal/dumansiz-gelecek.git
cd dumansiz-gelecek

# APK build
buildozer android release

# APK bin/ klasöründe oluşur
ls bin/
```

### Windows:
Windows'ta doğrudan derleme karmaşıktır.

**Seçenek 1 (Önerilen)**: GitHub Actions kullanın
- Repo'ya push edin
- Actions otomatik derler
- APK indir

**Seçenek 2 (Uzun)**: WSL 2 kullanın
```powershell
# WSL 2 kur
wsl --install -d Ubuntu-22.04

# WSL'de
wsl
cd /mnt/c/Users/USERNAME/Desktop/dumansiz-gelecek
# Yukarıdaki Linux komutlarını çalıştır
```

---

## 🔗 Teknoloji Stack

- **Kivy 2.2.1** - Python GUI Framework
- **Buildozer 1.6.0** - Android APK derleme aracı
- **Python 3.11** - Programming language
- **GitHub Actions** - CI/CD Pipeline
- **Android SDK 31** - Android framework
- **NDK 25.1** - Native Development Kit

---

## 📞 Bağlantılar

- **Web**: https://dumansiz.org
- **GitHub Repo**: https://github.com/tolgauysal/dumansiz-gelecek
- **Site URL**: https://tolgauysal.github.io/dumansiz-gelecek/
- **GitHub Pages**: docs/index.html

---

## 🆘 Sorun Giderme

### "Yükleme başarısız oldu" hatası
- ✅ Android sürümünü kontrol et (Min API 21 gerekli)
- ✅ Depolama alanını kontrol et (~60 MB)
- ✅ APK dosyasının bozuk olmadığını doğrula
- ✅ Bilinmeyen kaynaktan yükleme açık mı?

### APK Çalışmıyor / Açılmıyor
- ✅ İnternet bağlantınız var mı?
- ✅ Uygulama izinlerini kontrol et (INTERNET, ACCESS_NETWORK_STATE)
- ✅ Telefonu yeniden başlat

### APK Nerede?
1. **GitHub Releases**: https://github.com/tolgauysal/dumansiz-gelecek/releases
2. **GitHub Actions Artifacts**: Repo → Actions → Son build → Artifacts
3. **Web Sitesi**: https://tolgauysal.github.io/dumansiz-gelecek/
4. **Lokal (Manuel Build)**: bin/

### Build Başarısız Oldu (GitHub Actions)
- ✅ Logs'u kontrol et: Repo → Actions → Failed build → Logs
- ✅ buildozer.spec dosyasını kontrol et
- ✅ requirements.txt dosyasını kontrol et
- ✅ GitHub Issues'da açık sorunları kontrol et

---

## 📝 Lisans

Apache License 2.0 - [LICENSE](LICENSE) dosyasını incele

---

## 👤 Yazar

**Tolga Uysal**
- GitHub: [@tolgauysal](https://github.com/tolgauysal)
- Email: tolgauysal@gmail.com
- Web: https://dumansiz.org

---

## 🤝 Katkı

Bu proje açık kaynaktır. Katkı sağlamak istersen:

1. Repository'yi fork et
2. Feature branch'i oluştur (`git checkout -b feature/AmazingFeature`)
3. Değişiklikleri commit et (`git commit -m 'Add some AmazingFeature'`)
4. Branch'a push et (`git push origin feature/AmazingFeature`)
5. Pull Request oluştur

---

**Son Güncelleme**: 2 Haziran 2026  
**Sürüm**: 1.0.0  
**Durum**: ✅ Aktif Geliştirme

🎉 APK İndirdiğin için teşekkürler! Uygulamayı seversen ⭐ ver!
