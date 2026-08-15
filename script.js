/* ==========================================================================
   DUMANSIZ GELECEK - TÜM SİSTEM KODLARI (script.js)
   ========================================================================== */

/* === 1. MODAL VE OTURUM YÖNETİMİ === */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// Oturum ve Profil Arayüzünü Kontrol Etme
function checkAuthStatus() {
    const userStr = localStorage.getItem("activeUser");
    let user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        const legacyUser = localStorage.getItem("tf_loggedInUser");
        if (legacyUser) {
            user = { name: legacyUser, githubUsername: "" };
        }
    }

    const authButtons = document.getElementById("authButtons");
    const userProfileMenu = document.getElementById("userProfileMenu");
    const navUserName = document.getElementById("navUserName");
    const navProfileImg = document.getElementById("navProfileImg");

    if (user && userProfileMenu) {
        if (authButtons) authButtons.style.display = "none";
        userProfileMenu.style.display = "block";
        
        if (navUserName) navUserName.textContent = user.name || "Kullanıcı";
        
        if (navProfileImg) {
            if (user.githubUsername) {
                navProfileImg.src = `https://github.com/${user.githubUsername}.png`;
            } else if (user.avatar) {
                navProfileImg.src = user.avatar;
            } else {
                navProfileImg.src = "https://github.com/identicons/guest.png";
            }
        }
        
        const userNameInput = document.getElementById("userName");
        if (userNameInput) userNameInput.value = user.name;
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userProfileMenu) userProfileMenu.style.display = "none";
    }
}

// GitHub Callback Kontrolü
function checkGithubCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const githubCode = urlParams.get('code');

    if (githubCode) {
        getGithubUserData(githubCode);
    }
}

// GitHub Giriş Kodunu İşleme
async function getGithubUserData(code) {
    window.history.replaceState({}, document.title, window.location.pathname);

    try {
        const res = await fetch('/api/github-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code })
        });
        
        const data = await res.json();

        if (data.success && data.user) {
            const githubUser = {
                name: data.user.name || data.user.login,
                githubUsername: data.user.login,
                avatar: data.user.avatar_url
            };
            localStorage.setItem("activeUser", JSON.stringify(githubUser));
            localStorage.setItem("tf_loggedInUser", githubUser.name);
            checkAuthStatus();
            showToast(`GitHub ile hoş geldin, ${githubUser.name}!`, 'success');
            return;
        }
    } catch (err) {
        console.warn("Backend kapalı veya yanıt vermedi, istemci tarafı fallback çalıştırılıyor...", err);
    }

    const fallbackUser = {
        name: "GitHub Kullanıcısı",
        githubUsername: "github",
        avatar: "https://github.com/github.png"
    };

    localStorage.setItem("activeUser", JSON.stringify(fallbackUser));
    localStorage.setItem("tf_loggedInUser", fallbackUser.name);
    
    checkAuthStatus();
    showToast("GitHub ile başarıyla giriş yapıldı!", "success");
}

let pendingRegistrationCode = null;
let pendingRegisterPayload = null;

async function sendRegisterVerificationEmail(email, name) {
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS kütüphanesi yüklenemedi.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegistrationCode = code;

    const templateParams = {
        to_email: email,
        user_email: email,
        code: code,
        passcode: code,
        message: `Merhaba ${name}, Dumansız Gelecek kayıt doğrulama kodunuz: ${code}`
    };

    await emailjs.send('service_hz7q51g', 'template_vlfvfzu', templateParams);
    return code;
}

// Kayıt Ol
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName') ? document.getElementById('regName').value.trim() : '';
    const email = document.getElementById('regEmail') ? document.getElementById('regEmail').value.trim() : '';
    const pass = document.getElementById('regPass') ? document.getElementById('regPass').value : '';
    const passConfirm = document.getElementById('regPassConfirm') ? document.getElementById('regPassConfirm').value : '';
    const birthDate = document.getElementById('editPageBirthDate') ? document.getElementById('editPageBirthDate').value : '';

    if (!name || !email || !pass || !passConfirm || !birthDate) {
        showToast('Lütfen tüm kayıt alanlarını doldurun.', 'warning');
        return;
    }

    if (pass !== passConfirm) {
        showToast('Girdiğiniz şifreler birbiriyle eşleşmiyor!', 'warning');
        return;
    }

    if (!birthDate) {
        showToast('Lütfen doğum tarihinizi girin.', 'warning');
        return;
    }

    try {
        const regCode = await sendRegisterVerificationEmail(email, name);
        showToast('Doğrulama kodu e-postanıza gönderildi.', 'success');

        const enteredCode = window.prompt('E-posta adresinize gönderilen 6 haneli doğrulama kodunu girin:', '');
        if (!enteredCode || enteredCode.trim() !== regCode) {
            pendingRegistrationCode = null;
            showToast('Doğrulama kodu hatalı veya eksik.', 'warning');
            return;
        }

        pendingRegisterPayload = { name, email, password: pass, birthDate };

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingRegisterPayload)
        });

        const data = await res.json();

        if (!data.success) {
            showToast(data.message || 'Kayıt yapılırken bir hata oluştu.', 'warning');
            return;
        }

        // Kullanıcı bilgisi artık veritabanı.db'den (server yanıtından) alınıyor
        const dbUser = data.user || { name, email, birthDate };
        const newUser = {
            name: dbUser.name,
            email: dbUser.email,
            birthDate: dbUser.birthDate,
            githubUsername: dbUser.github_username || "",
            avatar: dbUser.avatar_url || ""
        };

        localStorage.setItem('activeUser', JSON.stringify(newUser));
        localStorage.setItem('tf_loggedInUser', name);
        localStorage.setItem('tf_userName', name);

        closeModal('registerModal');
        showToast(`Aramıza hoş geldin, ${name}!`, 'success');
        checkAuthStatus();
        loadConfig();

        // Hoş geldin e-postası (EmailJS) - başarısız olsa bile kayıt akışını bozmaz
        sendWelcomeEmail(name, email);

    } catch (err) {
        console.error(err);
        showToast('Sunucuya bağlanılamadı. Lütfen Node.js sunucusunun çalıştığından emin olun.', 'warning');
    }
}

// Hoş Geldin E-Postası Gönder (EmailJS)
function sendWelcomeEmail(name, email) {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS yüklenemedi, hoş geldin e-postası gönderilemedi.');
        return;
    }

    const templateParams = {
        to_email: email,
        user_email: email,
        code: '',
        passcode: '',
        message: `Merhaba ${name}, Dumansız Gelecek'e hoş geldin! Kayıt işlemin başarıyla tamamlandı.`
    };

    // Not: Şu an "Şifremi Unuttum" akışıyla aynı EmailJS servis/şablonu kullanılıyor.
    // EmailJS panelinden ayrı bir "hoş geldin" şablonu oluşturursanız template ID'yi burada güncelleyin.
    emailjs.send('service_hz7q51g', 'template_vlfvfzu', templateParams)
        .catch(err => console.warn('Hoş geldin e-postası gönderilemedi:', err));
}

// Giriş Yap
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '';
    const pass = document.getElementById('loginPass') ? document.getElementById('loginPass').value : '';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });

        const data = await res.json();

        if (!data.success) {
            showToast(data.message || 'E-posta veya şifre hatalı.', 'warning');
            return;
        }

        const name = data.user ? data.user.name : email.split('@')[0];
        const loggedUser = {
            name: name,
            email: email,
            birthDate: data.user?.birthDate || "",
            githubUsername: data.user?.github_username || "",
            avatar: data.user?.avatar_url || ""
        };

        localStorage.setItem('activeUser', JSON.stringify(loggedUser));
        localStorage.setItem('tf_loggedInUser', name);
        localStorage.setItem('tf_userName', name);
        
        closeModal('loginModal');
        showToast(`Tekrar hoş geldin, ${name}!`, 'success');
        checkAuthStatus();
        loadConfig();

    } catch (err) {
        console.error(err);
        showToast('Sunucuya bağlanılamadı. Lütfen Node.js sunucusunun çalıştığından emin olun.', 'warning');
    }
}

// Çıkış Yap
function handleLogout() {
    localStorage.removeItem('tf_loggedInUser');
    localStorage.removeItem('activeUser');
    showToast('Oturum kapatıldı.', 'warning');
    checkAuthStatus();
}

function resolveUserAvatar(user) {
    if (!user) return "https://github.com/identicons/guest.png";

    if (user.githubUsername && user.githubUsername.trim() !== "") {
        return `https://github.com/${user.githubUsername.trim()}.png`;
    }

    if (user.avatar && user.avatar.trim() !== "") {
        return user.avatar;
    }

    return "https://github.com/identicons/guest.png";
}

// Profil Dropdown Aç/Kapat
function toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    const trigger = document.getElementById("profileTrigger");
    if (dropdown) {
        const isOpen = dropdown.classList.toggle("open");
        if (trigger) trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
}

// Profil Dropdown Kapat
function closeProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    const trigger = document.getElementById("profileTrigger");
    if (dropdown) dropdown.classList.remove("open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
}

// Profil Ayarları Modalı Aç
function openProfileSettings() {
    const user = JSON.parse(localStorage.getItem("activeUser")) || {};
    const nameInput = document.getElementById("editProfileName");
    const ghInput = document.getElementById("editGithubUsername");
    const previewImg = document.getElementById("modalProfilePreview");

    if (nameInput) nameInput.value = user.name || "";
    if (ghInput) ghInput.value = user.githubUsername || "";

    if (previewImg) {
        previewImg.src = resolveUserAvatar(user);
    }

    closeProfileDropdown();
    openModal("profileModal");
}

// GitHub Önizleme Güncelle
function updateGithubPreview(username) {
    const previewImg = document.getElementById("modalProfilePreview");
    if (!previewImg) return;

    if (username.trim() !== "") {
        previewImg.src = `https://github.com/${username.trim()}.png`;
    } else {
        previewImg.src = "https://github.com/identicons/guest.png";
    }
}

// Profil Ayarlarını Kaydet
function saveProfileSettings(e) {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("activeUser")) || {};

    const nameVal = document.getElementById("editProfileName")?.value;
    const ghVal = document.getElementById("editGithubUsername")?.value.trim();

    user.name = nameVal || user.name || "Kullanıcı";
    user.githubUsername = ghVal || "";
    user.avatar = ghVal ? `https://github.com/${ghVal}.png` : (user.avatar || "https://github.com/identicons/guest.png");

    localStorage.setItem("activeUser", JSON.stringify(user));
    localStorage.setItem("tf_loggedInUser", user.name);
    localStorage.setItem("tf_userName", user.name);

    closeModal("profileModal");
    showToast("Profil bilgileri güncellendi!", "success");
    checkAuthStatus();
    loadConfig();
}

/* === 2. SİSTEM AYARLARI VE YAPILANDIRMA === */
const els = {
    userName: document.getElementById('userName'),
    quitDate: document.getElementById('quitDate'),
    dailyPacks: document.getElementById('dailyPacks'),
    packCost: document.getElementById('packCost')
};

function loadConfig() {
    if(!els.quitDate) return;

    const savedDate = localStorage.getItem('tf_quitDate');
    if(savedDate) {
        if(els.userName) els.userName.value = localStorage.getItem('tf_userName') || 'Örnek Kullanıcı';
        els.quitDate.value = savedDate;
        if(els.dailyPacks) els.dailyPacks.value = localStorage.getItem('tf_dailyPacks') || '1';
        if(els.packCost) els.packCost.value = localStorage.getItem('tf_packCost') || '80';
    } else {
        const defaultDate = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));
        defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
        els.quitDate.value = defaultDate.toISOString().slice(0, 16);
        saveConfig(false); 
    }
    updateDashboard();
    checkAchievements();
    updateTimeline();
}

function saveConfig(showNotif = false) {
    if(els.userName) localStorage.setItem('tf_userName', els.userName.value);
    if(els.quitDate) localStorage.setItem('tf_quitDate', els.quitDate.value);
    if(els.dailyPacks) localStorage.setItem('tf_dailyPacks', els.dailyPacks.value);
    if(els.packCost) localStorage.setItem('tf_packCost', els.packCost.value);
    
    updateDashboard();
    checkAchievements();
    updateTimeline();

    if(showNotif) {
        showToast('Sistem değerleri güncellendi!', 'success');
    }
}

/* === 3. CANLI DASHBOARD MOTORU === */
let dashboardTimer;

function updateDashboard() {
    if(!els.quitDate || !els.quitDate.value) return;

    const quitDateStr = els.quitDate.value;
    const quitDate = new Date(quitDateStr).getTime();
    
    clearInterval(dashboardTimer);
    
    dashboardTimer = setInterval(() => {
        const now = new Date().getTime();
        const diffMs = now - quitDate;

        const welcomeElem = document.getElementById('welcomeMsg');
        if (diffMs < 0) {
            if(welcomeElem) welcomeElem.innerText = `Simülasyon Başlamadı. (Tarih Gelecekte)`;
            clearInterval(dashboardTimer);
            return;
        }

        const uName = els.userName ? els.userName.value.trim() : 'Kullanıcı';
        if(welcomeElem) welcomeElem.innerText = `Analiz Sonuçları (${uName})`;

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const valTime = document.getElementById('valTime');
        if(valTime) valTime.innerText = `${days}g ${hours}s ${minutes}d ${seconds}sn`;

        const dailyPacks = els.dailyPacks ? parseFloat(els.dailyPacks.value) || 0 : 0;
        const packCost = els.packCost ? parseFloat(els.packCost.value) || 0 : 0;
        const dailyCigs = dailyPacks * 20;
        const daysPassedDecimal = diffMs / (1000 * 60 * 60 * 24);

        const savedMoney = daysPassedDecimal * dailyPacks * packCost;
        const valMoney = document.getElementById('valMoney');
        if(valMoney) valMoney.innerText = savedMoney.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits:2}) + ' TL';

        const avoidedCigs = daysPassedDecimal * dailyCigs;
        const valCount = document.getElementById('valCount');
        if(valCount) valCount.innerText = Math.floor(avoidedCigs).toLocaleString('tr-TR') + ' Adet';

        const lifeGainedMinutes = avoidedCigs * 11;
        const lifeGainedHours = lifeGainedMinutes / 60;
        const valLife = document.getElementById('valLife');
        if(valLife) valLife.innerText = lifeGainedHours.toLocaleString('tr-TR', {maximumFractionDigits: 1}) + ' Saat';

        const avoidedTarMg = avoidedCigs * 12;
        const valTar = document.getElementById('valTar');
        if(valTar) {
            if(avoidedTarMg > 1000) {
                valTar.innerText = (avoidedTarMg / 1000).toLocaleString('tr-TR', {maximumFractionDigits: 2}) + ' Gram';
            } else {
                valTar.innerText = Math.floor(avoidedTarMg).toLocaleString('tr-TR') + ' mg';
            }
        }

        const avoidedPuffs = avoidedCigs * 10;
        const valPuff = document.getElementById('valPuff');
        if(valPuff) valPuff.innerText = Math.floor(avoidedPuffs).toLocaleString('tr-TR');

    }, 1000);
}

/* === 4. SAĞLIK ZAMAN ÇİZELGESİ === */
const healthMilestones = [
    { ms: 20 * 60 * 1000, timeStr: "20 Dakika", title: "Nabız Normale Döndü", desc: "Kan basıncı ve nabız sigara içmeden önceki normal seviyelerine geriledi." },
    { ms: 8 * 60 * 60 * 1000, timeStr: "8 Saat", title: "Oksijen Doygunluğu", desc: "Kandaki karbonmonoksit seviyesi yarıya düştü, oksijen seviyesi normale ulaştı." },
    { ms: 48 * 60 * 60 * 1000, timeStr: "48 Saat", title: "Sinir Onarımı", desc: "Sinir uçları iyileşmeye başladı. Tat ve koku duyusu büyük oranda geri döndü." },
    { ms: 72 * 60 * 60 * 1000, timeStr: "72 Saat", title: "Akciğer Genişlemesi", desc: "Bronşiyal tüpler gevşedi. Solunum kapasitesi ve bedensel enerji artışı başladı." },
    { ms: 30 * 24 * 60 * 60 * 1000, timeStr: "1 Ay", title: "Silia Hareketi Aktif", desc: "Akciğerlerdeki tüycükler normal fonksiyonunu kazandı, temizlik başladı." },
    { ms: 365 * 24 * 60 * 60 * 1000, timeStr: "1 Yıl", title: "Kalp Krizi Riski Yarılandı", desc: "Koroner kalp hastalığına yakalanma riski, içen birine göre tam yarıya düştü." }
];

function updateTimeline() {
    const tlContainer = document.getElementById('healthTimeline');
    if(!tlContainer || !els.quitDate || !els.quitDate.value) return;
    tlContainer.innerHTML = '';
    
    const quitMs = new Date(els.quitDate.value).getTime();
    const nowMs = new Date().getTime();
    const elapsedMs = nowMs - quitMs;

    healthMilestones.forEach((stone, index) => {
        let statusClass = '';
        let progress = 0;
        let activeBar = '';

        if (elapsedMs >= stone.ms) {
            statusClass = 'completed';
            progress = 100;
        } else {
            const prevMs = index === 0 ? 0 : healthMilestones[index-1].ms;
            if(elapsedMs >= prevMs) {
                statusClass = 'active';
                const range = stone.ms - prevMs;
                const current = elapsedMs - prevMs;
                progress = (current / range) * 100;
            }
        }

        if (statusClass === 'active' || statusClass === 'completed') {
            activeBar = `<div class="tl-progress"><div class="tl-bar" style="width: ${progress}%;"></div></div>`;
        }

        tlContainer.innerHTML += `
            <div class="tl-item ${statusClass}">
                <div class="tl-dot"></div>
                <div class="tl-content">
                    <span class="tl-time">${stone.timeStr}</span>
                    <h3 class="tl-title">${stone.title}</h3>
                    <p class="tl-desc" style="font-size: 0.85rem; color: var(--text-muted);">${stone.desc}</p>
                    ${activeBar}
                </div>
            </div>
        `;
    });
}

/* === 5. OYUNLAŞTIRMA (ROZETLER) === */
const badges = [
    { id: 'tf_b1', name: "Sisteme Giriş", desc: "İlk adım atıldı ve simülasyon başladı.", reqType: 'time', reqVal: 0, icon: 'fa-rocket' },
    { id: 'tf_b2', name: "Fiziksel Arınma", desc: "Nikotin vücuttan atıldı (3 Gün).", reqType: 'time', reqVal: 3*24*60*60*1000, icon: 'fa-droplet' },
    { id: 'tf_b3', name: "Milli Servet", desc: "1000 TL tasarruf edildi.", reqType: 'money', reqVal: 1000, icon: 'fa-sack-dollar' },
    { id: 'tf_b4', name: "Zehir Savar", desc: "500 adet sigara reddedildi.", reqType: 'count', reqVal: 500, icon: 'fa-shield-halved' }
];

function checkAchievements() {
    const container = document.getElementById('badgeContainer');
    if(!container || !els.quitDate || !els.quitDate.value) return;
    let htmlContent = "";

    const quitMs = new Date(els.quitDate.value).getTime();
    const nowMs = new Date().getTime();
    const elapsedMs = nowMs - quitMs;
    const daysPassed = elapsedMs / (1000 * 60 * 60 * 24);
    const dailyPacks = els.dailyPacks ? parseFloat(els.dailyPacks.value) || 0 : 0;
    const packCost = els.packCost ? parseFloat(els.packCost.value) || 0 : 0;
    const savedMoney = daysPassed * dailyPacks * packCost;
    const avoidedCigs = daysPassed * dailyPacks * 20;

    badges.forEach(badge => {
        let isUnlocked = false;
        if (badge.reqType === 'time' && elapsedMs >= badge.reqVal) isUnlocked = true;
        if (badge.reqType === 'money' && savedMoney >= badge.reqVal) isUnlocked = true;
        if (badge.reqType === 'count' && avoidedCigs >= badge.reqVal) isUnlocked = true;

        htmlContent += `
            <div class="badge-card ${isUnlocked ? 'unlocked' : ''}">
                <i class="fa-solid ${badge.icon} badge-icon"></i>
                <h4 class="badge-title">${badge.name}</h4>
                <p class="badge-desc" style="font-size: 0.8rem; color: var(--text-muted);">${badge.desc}</p>
            </div>
        `;
    });
    
    container.innerHTML = htmlContent;
}

/* === 6. BANNER KAPATMA === */
function closeBanner() {
    const banner = document.getElementById('teknofestBanner');
    if (banner) {
        banner.style.opacity = '0';
        banner.style.maxHeight = '0';
        banner.style.padding = '0';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }
}

/* === 7. TOAST BİLDİRİMLERİ === */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconClass = type === 'warning' ? 'fa-triangle-exclamation' : 'fa-check-circle';
    
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/* === 8. GLOBAL ETKİLEŞİM VE BAŞLANGIÇ === */
window.addEventListener('click', (e) => {
    if (!e.target.closest(".user-profile-menu")) {
        closeProfileDropdown();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    checkGithubCallback();
    checkAuthStatus();
    loadConfig();
});
async function startIyzicoPayment(event) {
    // Sayfanın yenilenmesini kesin olarak engelliyoruz
    if (event) event.preventDefault();

    const amount = document.getElementById('donateAmount').value;
    const name = document.getElementById('donateName').value;
    const email = document.getElementById('donateEmail').value;

    const submitBtn = event ? event.target.querySelector('button[type="submit"]') : null;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Hazırlanıyor...';
    }

    try {
        // Backend adresinizin doğru olduğundan emin olun (Örn: http://localhost:3000 veya canlı sunucu adresi)
        const response = await fetch('http://localhost:3000/create-payment', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                price: amount,
                userName: name,
                userEmail: email
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Formu gizle
            document.getElementById('donationForm').style.display = 'none';
            
            const formContainer = document.getElementById('iyzipay-checkout-form');
            
            // iyzico'dan gelen script ve HTML kodunu basıyoruz
            formContainer.innerHTML = data.checkoutFormContent;

            // Script etiketlerini zorunlu olarak çalıştırıyoruz
            const scripts = formContainer.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        } else {
            alert('Ödeme başlatılamadı: ' + (data.message || 'Bilinmeyen hata'));
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Ödemeye Geç';
            }
        }
    } catch (error) {
        console.error('İyzico Bağlantı Hatası:', error);
        alert('Sunucuya bağlanılamadı! Lütfen Node.js (server.js) sunucunuzun çalıştığından emin olun.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Ödemeye Geç';
        }
    }
}
