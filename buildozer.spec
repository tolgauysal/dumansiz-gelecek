[app]

# Uygulama başlığı
title = Dumansız Gelecek

# Paket bilgileri
package.name = dumansizelecek
package.domain = org.dumansiz

# Kaynak dizini
source.dir = .
source.include_exts = py,png,jpg,kv,atlas

# Sürüm
version = 1.0.0

# Bağımlılıklar
requirements = python3,kivy,android,pyjnius,requests

# Ekran ayarları
orientation = portrait
fullscreen = 0
require_internet = yes

# Android izinleri
permissions = INTERNET,ACCESS_NETWORK_STATE,ACCESS_FINE_LOCATION

# Android SDK ayarları
android.permissions = INTERNET,ACCESS_NETWORK_STATE,ACCESS_FINE_LOCATION
android.api = 31
android.minapi = 21
android.ndk = 25.1.8937393
android.accept_sdk_license = True
android.arch = armeabi-v7a

# Kivy bootstrap
p4a.bootstrap = sdl2
p4a.requirements = python3,kivy,pyjnius,requests

# Gradle bağımlılıkları
android.gradle_dependencies = 

# Permissions
android.uses_permission = android.permission.INTERNET
android.uses_permission = android.permission.ACCESS_NETWORK_STATE

[buildozer]

# Log level
log_level = 2
warn_on_root = 1
