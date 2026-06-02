[app]
title = Dumansız Gelecek
package.name = dumansizelecek
package.domain = org.dumansiz

source.dir = .
source.include_exts = py,png,jpg,kv,atlas

version = 1.0.0

requirements = python3,pyjnius,android
orientation = portrait
fullscreen = 0

permissions = INTERNET,ACCESS_NETWORK_STATE

# Android özel ayarlar
android.permissions = INTERNET,ACCESS_NETWORK_STATE
android.api = 31
android.minapi = 21
android.ndk = 25.1.8937393
android.accept_sdk_license = True
android.gradle_dependencies = 

[buildozer]
log_level = 2
warn_on_root = 1
