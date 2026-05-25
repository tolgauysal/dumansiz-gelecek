# Dumansız Gelecek - Siber Güvenlik ve Veri Politikası Rehberi

Bu doküman, "Dumansız Gelecek: İnteraktif Sağlık Simülasyonu" projesinin siber güvenlik standartlarını, veri gizliliği politikalarını ve olası kaynak kodu zafiyetlerinin bildirilme süreçlerini kararlılıkla tanımlamak amacıyla oluşturulmuştur.

---

## 1. Desteklenen Yazılım Sürümleri (Supported Versions)

Aşağıdaki matris, platformumuzun hangi ana ve alt sürümlerinin siber güvenlik yamaları ve optimizasyon süreçleriyle aktif olarak desteklendiğini göstermektedir:

| Proje Sürümü (Version) | Güvenlik Desteği (Supported) | Detaylar / Açıklamalar |
| ---------------------- | ---------------------------- | ---------------------- |
| v1.0.x (Güncel)        | :white_check_mark: Active    | İlk resmi kararlı sürüm. Yamalar anlık uygulanır. |
| v0.5.x (Beta)          | :x: Unsupported              | Geliştirme aşaması sürümleri güvenliğe kapatılmıştır. |

---

## 2. Sıfır Sunucu (Zero-Server) Mimarisi ve Yerel Güvenlik

Projemiz, "İnsanlık Yararına Teknoloji" felsefesiyle üretilmiş olup, kullanıcıların hiçbir kişisel verisini uzak sunucularda (Cloud, Remote DB) işlemez.

* **Veri Sızıntısı Kalkanı:** Sistemde hiçbir backend (arka plan) veri tabanı bağlantısı bulunmadığından, siber korsanların kullanıcı verilerine sızabileceği bir hedef tahtası bulunmamaktadır.
* **Tarayıcı Tabanlı İzolasyon:** Girilen tüm parametreler (isim, sigara tüketim oranları vb.) yalnızca kullanıcının yerel tarayıcısındaki `LocalStorage` apisi üzerinde izole edilir.
* **XSS (Cross-Site Scripting) Koruması:** Proje kaynak kodlarında, kullanıcı girdilerini filtrelemeden DOM (Document Object Model) içerisine basan tehlikeli fonksiyonlardan (örn: `innerHTML`) kaçınılmış, bunun yerine güvenli olan `innerText` ve `textContent` tercih edilmiştir.

---

## 3. OWASP Standartları ve Kod Denetimi (Code Auditing)

Dumansız Gelecek platformu, dünya genelinde kabul görmüş web güvenliği standartlarına göre test edilmiştir:

1. **Güvenilir Üçüncü Parti Kütüphaneleri:** Projede kullanılan FontAwesome ve Google Fonts gibi CDN bağlantıları, yalnızca en güvenilir ve SHA-384 şifreleme bütünlük doğrulama (Integrity) kodlarına sahip resmi kaynaklardan çekilmektedir.
2. **Girdi Doğrulaması (Input Validation):** Kullanıcı arayüzünde (UI) yer alan nümerik alanlar, eksi değer almayı engelleyecek `step` ve `min` nitelikleriyle donatılmış olup, tarayıcı kilitlenmelerine yol açabilecek manipülatif veri girişleri JavaScript filtreleriyle engellenmiştir.

---

## 4. Güvenlik Açığı Bildirim Prosedürü (Reporting a Vulnerability)

Kaynak kodlarımız üzerinde herhangi bir mantıksal hata, bellek sızıntısı (Memory Leak) veya güvenlik zafiyeti tespit etmeniz durumunda izlemeniz gereken adımlar aşağıda belirtilmiştir:

### A. Bildirim Kanalları
Lütfen bulduğunuz açıkları projenin GitHub "Issues" (Sorunlar) sekmesinde herkese açık bir şekilde paylaşarak kötü niyetli kişilerin kullanımına açmayın. Bunun yerine:
* Doğrudan ve gizli olarak şu e-posta adresine detaylı bir rapor gönderin: **tolgauysal.dev@gmail.com**

### B. Rapor İçeriğinde Bulunması Gerekenler
Göndereceğiniz siber güvenlik raporunun hızlıca çözülebilmesi için şu maddeleri içermesi önerilir:
1. Zafiyetin türü ve projedeki tam dosya/satır konumu.
2. Açığın tetiklenebilmesi için izlenecek adımların detaylı tarifi (Proof of Concept - PoC).
3. Varsa hataya dair ekran görüntüsü veya tarayıcı konsol çıktısı günlükleri.

---

## 5. Değerlendirme ve SLA (Hizmet Seviyesi Taahhüdü) Süreçleri

* **İlk Geri Dönüş:** İletilen siber güvenlik bildirimleri, Proje Mimarı ve Takım Kaptanı Tolga Uysal tarafından en geç **48 saat** içerisinde incelemeye alınır ve zafiyeti bildiren tarafa alındı onayı gönderilir.
* **Yama Döngüsü:** Doğruluğu onaylanan kritik güvenlik açıkları için en geç **7 iş günü** içerisinde yeni bir hotfix (yama) sürümü (örn: v1.0.1) yayınlanarak GitHub üzerinde canlıya alınır.
* **Teşekkür ve Atıf:** Projemizin güvenliğine katkıda bulunan araştırmacıların isimleri, eğer kendileri de arzu ederse, projenin ana sayfasındaki `CONTRIBUTORS.md` (Katkıda Bulunanlar) listesine eklenerek onurlandırılır.

---

## 6. Yasal Bildirim ve MIT Lisansı Güvencesi

Bu proje, açık kaynak dünyasının en şeffaf lisanslarından biri olan **MIT Lisansı** ile korunmaktadır. 

> "Yazılım, herhangi bir garanti verilmeksizin 'olduğu gibi' sunulmaktadır. Geliştirici, yazılımın kullanımından kaynaklanabilecek doğrudan veya dolaylı hiçbir zarardan yasal olarak sorumlu tutulamaz."

Ancak Dumansız Gelecek takımı olarak, projenin siber dünyada en güvenli ve kararlı şekilde çalışabilmesi için güncellemeleri durmaksızın sürdüreceğimizi beyan ederiz.

---

## 7. Siber Hijyen ve Kullanıcı Sorumlulukları

Uygulamanın yerelde maksimum güvenlikle çalışabilmesi adına son kullanıcıların şu temel siber hijyen kurallarına uyması tavsiye edilir:
* Ortak veya halka açık bilgisayarlarda (örn: internet kafeler, kütüphaneler) uygulamayı kullandıktan sonra tarayıcı geçmişini ve çerezleri tamamen temizleyin.
* Tarayıcınızın ve işletim sisteminizin en güncel kararlı sürümlerini kullandığınızdan emin olun.
* GitHub üzerindeki projemizi kendi sunucunuza kopyalarken (Fork ederken) her zaman resmi ana depoyu (Upstream) referans alın.

---

## 8. Sürdürülebilirlik ve Gelecek Güvenlik Planları (v2.0 Planı)

Gelecek sürümlerde (v2.0.0 ve sonrası), `LocalStorage` verilerinin daha da güvenli hale getirilmesi amacıyla şu teknolojilerin kod tabanına eklenmesi planlanmaktadır:
* Kullanıcı verilerinin tarayıcıya kaydedilmeden önce **AES-256 algoritması** ile istemci tarafında şifrelenmesi.
* Web Crypto API entegrasyonu ile biyolojik verilerin bütünlüğünün tarayıcı seviyesinde tam korumaya alınması.

---

*Bu siber güvenlik politikası en son **25 Mayıs 2026** tarihinde güncellenmiştir ve projenin resmi güvenlik anayasasıdır.*
