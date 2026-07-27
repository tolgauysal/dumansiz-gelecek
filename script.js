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

// --- VERİ TABANI BAĞLANTILI VE E-POSTA DESTEKLİ KAYIT OL ---
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName') ? document.getElementById('regName').value.trim() : '';
    const email = document.getElementById('regEmail') ? document.getElementById('regEmail').value.trim() : '';
    const pass = document.getElementById('regPass') ? document.getElementById('regPass').value : '';
    const passConfirm = document.getElementById('regPassConfirm') ? document.getElementById('regPassConfirm').value : '';

    // Şifre Uyuşmazlığı Kontrolü
    if (pass !== passConfirm) {
        showToast('Girdiğiniz şifreler birbiriyle eşleşmiyor!', 'warning');
        return;
    }

    try {
        // 1. Node.js Backend API'sine Kayıt İsteği At
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass })
        });

        const data = await res.json();

        if (!data.success) {
            showToast(data.message || 'Kayıt yapılırken bir hata oluştu.', 'warning');
            return;
        }

        // 2. EmailJS ile Hoş Geldin E-postası Gönder
        if (typeof emailjs !== 'undefined') {
            const templateParams = {
                user_name: name,
                user_email: email,
                message: 'Dumansız Gelecek platformuna hoş geldiniz! Sağlıklı bir yaşama ilk adımı başarıyla attınız.'
            };
            emailjs.send('service_hz7q51g', 'template_kov6opk', templateParams)
                .then(res => console.log('EmailJS: E-posta başarıyla gönderildi!', res.status))
                .catch(err => console.error('EmailJS Hatası:', err));
        }

        // 3. Oturumu Başlat ve Arayüzü Güncelle
        localStorage.setItem('tf_loggedInUser', name);
        localStorage.setItem('tf_userName', name);
        
        closeModal('registerModal');
        showToast(`Aramıza hoş geldin, ${name}!`, 'success');
        checkUserAuth();
        loadConfig();

    } catch (err) {
        console.error(err);
        showToast('Sunucuya bağlanılamadı. Lütfen Node.js sunucusunun çalıştığından emin olun.', 'warning');
    }
}

// --- VERİ TABANI BAĞLANTILI GİRİŞ YAP ---
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '';
    const pass = document.getElementById('loginPass') ? document.getElementById('loginPass').value : '';

    try {
        // Node.js Backend API'sine Giriş İsteği At
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
        
        localStorage.setItem('tf_loggedInUser', name);
        localStorage.setItem('tf_userName', name);
        
        closeModal('loginModal');
        showToast(`Tekrar hoş geldin, ${name}!`, 'success');
        checkUserAuth();
        loadConfig();

    } catch (err) {
        console.error(err);
        showToast('Sunucuya bağlanılamadı. Lütfen Node.js sunucusunun çalıştığından emin olun.', 'warning');
    }
}

function handleLogout() {
    localStorage.removeItem('tf_loggedInUser');
    showToast('Oturum kapatıldı.', 'warning');
    checkUserAuth();
}

function checkUserAuth() {
    const user = localStorage.getItem('tf_loggedInUser');
    const authDiv = document.getElementById('authButtons');
    
    if(!authDiv) return;

    if(user) {
        authDiv.innerHTML = `
            <span style="font-size: 0.9rem; font-weight: 600; color: var(--primary-light);"><i class="fa-solid fa-user"></i> ${user}</span>
            <button class="btn btn-outline" onclick="handleLogout()" style="padding: 5px 10px; font-size: 0.8rem;">Çıkış</button>
        `;
    } else {
        authDiv.innerHTML = `
            <button class="btn btn-outline" onclick="openModal('loginModal')">
                <i class="fa-solid fa-right-to-bracket"></i> Giriş Yap
            </button>
            <button class="btn btn-primary" onclick="openModal('registerModal')">
                <i class="fa-solid fa-user-plus"></i> Kayıt Ol
            </button>
        `;
    }
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

/* === 6. KRİZ ANI: NEFES EGZERSİZİ === */
const btnStartBreathe = document.getElementById('btnStartBreathe');
const btnStopBreathe = document.getElementById('btnStopBreathe');
const breatheCircle = document.getElementById('breatheCircle');
const breatheText = document.getElementById('breatheText');
let breatheTimeouts = [];
let breatheInterval;
let isBreathing = false;

function clearBreatheTimeouts() {
    breatheTimeouts.forEach(t => clearTimeout(t));
    breatheTimeouts = [];
}

function breatheCycle() {
    if(!isBreathing || !breatheCircle || !breatheText) return;
    
    breatheText.innerText = "Burnundan Nefes Al...";
    breatheCircle.className = 'circle-animated breathe-inhale';
    breatheCircle.innerText = "AL";

    breatheTimeouts.push(setTimeout(() => {
        if(!isBreathing) return;
        breatheText.innerText = "İçinde Tut...";
        breatheCircle.className = 'circle-animated breathe-hold';
        breatheCircle.innerText = "TUT";

        breatheTimeouts.push(setTimeout(() => {
            if(!isBreathing) return;
            breatheText.innerText = "Ağzından Yavaşça Ver...";
            breatheCircle.className = 'circle-animated breathe-exhale';
            breatheCircle.innerText = "VER";
        }, 7000));

    }, 4000));
}

if(btnStartBreathe) {
    btnStartBreathe.addEventListener('click', () => {
        isBreathing = true;
        btnStartBreathe.style.display = 'none';
        if(btnStopBreathe) btnStopBreathe.style.display = 'inline-flex';
        breatheCycle();
        breatheInterval = setInterval(breatheCycle, 19000);
    });
}

if(btnStopBreathe) {
    btnStopBreathe.addEventListener('click', () => {
        isBreathing = false;
        clearInterval(breatheInterval);
        clearBreatheTimeouts();
        if(btnStartBreathe) btnStartBreathe.style.display = 'inline-flex';
        btnStopBreathe.style.display = 'none';
        if(breatheText) breatheText.innerText = "Terapi Durduruldu";
        if(breatheCircle) {
            breatheCircle.className = 'circle-animated';
            breatheCircle.innerText = "Hazır";
        }
    });
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

/* === 8. BANNER KAPATMA === */
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

/* === BAŞLANGIÇ ÇAĞRILARI === */
window.addEventListener('DOMContentLoaded', () => {
    checkUserAuth();
    loadConfig(); 
    setTimeout(() => {
    }, 1000);
});