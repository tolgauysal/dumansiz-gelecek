/* ==========================================================================
   DUMANSIZ GELECEK - Ana Mantık ve Etkileşim Scripti (Full Production Ready)
   Geliştirici: Tolga Uysal
   ========================================================================== */

// Çakışma koruması (Global scope kontrolü)
if (typeof window.DUMANSIZ_APP_INITIALIZED === 'undefined') {
    window.DUMANSIZ_APP_INITIALIZED = true;

    // --- Global Değişkenler ve Başlangıç Verileri ---
    let timerInterval = null;
    let breatheInterval = null;
    let currentLang = 'tr';
    const COOKIE_CONSENT_KEY = 'dumansiz_cookie_consent';

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setCookie(name, value, days) {
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expiry.toUTCString()};path=/;SameSite=Lax`;
    }

    function hasCookieConsent() {
        return getCookie(COOKIE_CONSENT_KEY) === 'accepted';
    }

    function applyConsentGateState() {
        const consentOverlay = document.getElementById('cookieConsentGate');
        if (!consentOverlay) return;

        if (hasCookieConsent()) {
            consentOverlay.style.display = 'none';
            document.body.classList.remove('cookie-gate-open');
            return;
        }

        consentOverlay.style.display = 'flex';
        document.body.classList.add('cookie-gate-open');
    }

    window.acceptCookieConsent = function() {
        setCookie(COOKIE_CONSENT_KEY, 'accepted', 365);
        applyConsentGateState();
        if (typeof initApplicationLogic === 'function') {
            initApplicationLogic();
        }
    };

    window.rejectCookieConsent = function() {
        setCookie(COOKIE_CONSENT_KEY, 'rejected', 365);
        applyConsentGateState();
    };

    // Çeviri Sözlüğü (TR / EN / FR)
    const translations = {
        tr: {
            tf_banner: "🇹🇷 TEKNOFEST 2027 | İNSANLIK YARARINA TEKNOLOJİ YARIŞMASI",
            nav_credits: "Künye",
            nav_dashboard: "Panel",
            nav_achievements: "Başarılar",
            nav_health: "Sağlık",
            nav_firstaid: "İlk Yardım",
            btn_login: "Giriş Yap",
            btn_register: "Kayıt Ol",
            notif_title: "Duyurular & Bilgi",
            notif_tag1: "🚀 Sistem Güncellemesi v2.4",
            notif_desc1: "Canlı takip algoritması ve 4-7-8 nefes terapisi modülü başarıyla yenilendi!",
            notif_tag2: "ℹ️ Platform Hakkında",
            notif_desc2: "Dumansız Gelecek, sigara bağımlılığıyla mücadele eden kişilere özel geliştirilmiş ücretsiz bir dijital takip asistanıdır.",
            notif_tag3: "📲 Mobil",
            notif_desc3: "Android sürümlerimizi sayfanın en altındaki bağlantılardan doğrudan indirebilirsiniz.",
            profile_settings: "Profil Ayarları",
            profile_logout: "Çıkış Yap",
            profile_hint: "Profil resminiz GitHub hesabınızdan otomatik çekilir.",
            lbl_fullname: "Ad Soyad",
            lbl_github_user: "GitHub Kullanıcı Adı (Fotoğraf İçin)",
            btn_save_update: "Kaydet ve Güncelle",
            lbl_email: "E-Posta Adresi",
            lbl_pass: "Şifre",
            btn_login_submit: "Oturum Aç",
            or_divider: "VEYA",
            btn_github_login: "GitHub ile Giriş Yap",
            btn_google_login: "Google ile Giriş Yap",
            lbl_birthdate: "Doğum Tarihi",
            lbl_pass_confirm: "Şifreyi Onayla",
            lbl_kvkk: "6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesine ilişkin Aydınlatma Metni'ni okudum ve kabul ediyorum.",
            lbl_age_confirm: "18 yaşından büyük olduğumu onaylıyorum.",
            btn_create_account: "Hesap Oluştur",
            btn_github_register: "GitHub ile Kayıt Ol",
            btn_google_register: "Google ile Kayıt Ol",
            hint_github_terms: "* GitHub ile kayıt olmak için onay kutularını işaretlemelisiniz.",
            welcome_tolga: "Merhaba Ben",
            desc_tolga: "Türkiye Cumhuriyeti öğrencisi ve TEKNOFEST'e bireysel katılımcı olarak bu projeyi geliştiriyorum. Volkan Mutlu'nun danışmanlığında, sigarayı bırakma sürecini destekleyen erişilebilir bir sağlık teknolojisi geliştirmeyi amaçlıyorum.",
            tag_dev_tolga: "Geliştirici: Tolga Uysal",
            tag_category: "Kategori: Sağlık ve İlk Yardım",
            tag_tech: "İnsanlık Yararına Teknoloji",
            welcome_volkan: "Merhaba Ben",
            desc_volkan: "Projenin danışmanı ve süreç ortağıyım. Türkiye Cumhuriyeti'nin tam bağımsız teknoloji hamlesine katkı sunmak ve genç nesilleri zararlı bağımlılıklardan koruyarak sigara kaynaklı sağlık kayıplarının önüne geçmek amacıyla bu yola çıktım.",
            tag_dev_volkan: "Danışman: Volkan Mutlu",
            sim_title: "Kullanıcı Simülasyonu",
            sim_desc: "Sayın jüri, değerleri değiştirerek sistemin anlık tepkilerini test edebilirsiniz.",
            lbl_username: "Kullanıcı Adı",
            lbl_quitdate: "Bırakma Tarihi",
            lbl_dailypacks: "Günlük Tüketim (Paket)",
            lbl_packcost: "1 Paket Fiyatı (TL)",
            btn_update_sim: "Simülasyonu Güncelle",
            algo_working: "Algoritma Çalışıyor...",
            stat_smokefree_time: "Dumansız Süre",
            stat_smokefree_sub: "Özgürlüğe atılan adımlar",
            stat_money_saved: "Kurtarılan Milli Servet",
            stat_money_sub: "Ülke ekonomisine katkı",
            stat_cigs_avoided: "İçilmeyen Sigara",
            stat_cigs_sub: "Zehirden kaçınıldı",
            stat_life_gained: "Kazanılan Ömür",
            stat_life_sub: "Hayata eklenen zaman",
            stat_tar_avoided: "Alınmayan Katran",
            stat_tar_sub: "Ciğerlerimiz temiz kaldı",
            stat_puffs_avoided: "Çekilmeyen Nefes",
            stat_puffs_sub: "Zehirli nefes engellendi",
            achieve_title: "Başarılar ve Rozetler",
            achieve_desc: "Kullanıcının ilerlemesini ödüllendiren oyunlaştırma modülü.",
            health_title: "Vücudun Yenilenme Algoritması",
            health_desc: "Tıbbi literatür taranarak oluşturulmuş gerçek zamanlı sağlık ilerleme haritası.",
            breathe_title: "İlk Yardım: 4-7-8 Nefes Terapisi Modülü",
            breathe_desc: "Parasempatik sinir sistemini harekete geçirerek ani nikotin krizlerini dindiren egzersiz yazılımı.",
            breathe_start_hint: "Sistemi başlatmak için tıklayın",
            breathe_ready: "Hazır",
            breathe_btn_start: "Başlat",
            breathe_btn_stop: "Durdur"
        },
        en: {
            tf_banner: "🇹🇷 TEKNOFEST 2027 | TECHNOLOGY FOR HUMANITY COMPETITION",
            nav_credits: "Credits",
            nav_dashboard: "Dashboard",
            nav_achievements: "Achievements",
            nav_health: "Health",
            nav_firstaid: "First Aid",
            btn_login: "Sign In",
            btn_register: "Register",
            notif_title: "Announcements & Info",
            notif_tag1: "🚀 System Update v2.4",
            notif_desc1: "Live tracking algorithm and 4-7-8 breathing therapy module successfully updated!",
            notif_tag2: "ℹ️ About Platform",
            notif_desc2: "Dumansız Gelecek is a free digital tracking assistant designed for individuals fighting nicotine addiction.",
            notif_tag3: "📲 Mobile",
            notif_desc3: "You can download our Android builds directly from the links at the bottom.",
            profile_settings: "Profile Settings",
            profile_logout: "Sign Out",
            profile_hint: "Your profile picture is automatically retrieved from your GitHub account.",
            lbl_fullname: "Full Name",
            lbl_github_user: "GitHub Username (For Avatar)",
            btn_save_update: "Save and Update",
            lbl_email: "Email Address",
            lbl_pass: "Password",
            btn_login_submit: "Log In",
            or_divider: "OR",
            btn_github_login: "Sign in with GitHub",
            btn_google_login: "Sign in with Google",
            lbl_birthdate: "Birth Date",
            lbl_pass_confirm: "Confirm Password",
            lbl_kvkk: "I have read and accept the Privacy and KVKK Disclosure Text regarding the processing of my personal data.",
            lbl_age_confirm: "I confirm that I am over 18 years old.",
            btn_create_account: "Create Account",
            btn_github_register: "Register with GitHub",
            btn_google_register: "Register with Google",
            hint_github_terms: "* You must check the agreement boxes to register with GitHub.",
            welcome_tolga: "Hello I'm",
            desc_tolga: "With the vision of National Technology Move, we continue to develop this project to protect youth and families from nicotine addiction. Welcome to this platform digitizing the body's self-healing miracle!",
            tag_dev_tolga: "Developer: Tolga Uysal",
            tag_category: "Category: Health & First Aid",
            tag_tech: "Technology for Humanity",
            welcome_volkan: "Hello I'm",
            desc_volkan: "I am the project consultant and process partner. I set out on this journey to contribute to Turkey's fully independent technology move and protect young generations from harmful addictions.",
            tag_dev_volkan: "Consultant: Volkan Mutlu",
            sim_title: "User Simulation",
            sim_desc: "Dear jury, you can test system responses instantly by changing values.",
            lbl_username: "User Name",
            lbl_quitdate: "Quit Date",
            lbl_dailypacks: "Daily Consumption (Pack)",
            lbl_packcost: "1 Pack Price (TL)",
            btn_update_sim: "Update Simulation",
            algo_working: "Algorithm Running...",
            stat_smokefree_time: "Smoke-Free Time",
            stat_smokefree_sub: "Steps towards freedom",
            stat_money_saved: "National Wealth Saved",
            stat_money_sub: "Contribution to economy",
            stat_cigs_avoided: "Cigarettes Avoided",
            stat_cigs_sub: "Poison avoided",
            stat_life_gained: "Life Gained",
            stat_life_sub: "Time added to life",
            stat_tar_avoided: "Tar Avoided",
            stat_tar_sub: "Lungs stayed clean",
            stat_puffs_avoided: "Puffs Avoided",
            stat_puffs_sub: "Toxic breath blocked",
            achieve_title: "Achievements & Badges",
            achieve_desc: "Gamification module rewarding user progress.",
            health_title: "Body Regeneration Algorithm",
            health_desc: "Real-time health progression map built on medical literature.",
            breathe_title: "First Aid: 4-7-8 Breathing Therapy Module",
            breathe_desc: "Exercise software soothing sudden nicotine cravings by triggering parasympathetic nervous system.",
            breathe_start_hint: "Click to start the system",
            breathe_ready: "Ready",
            breathe_btn_start: "Start",
            breathe_btn_stop: "Stop"
        },
        fr: {
            tf_banner: "🇹🇷 TEKNOFEST 2027 | CONCOURS TECHNOLOGIE POUR L'HUMANITÉ",
            nav_credits: "Crédits",
            nav_dashboard: "Tableau de Bord",
            nav_achievements: "Réalisations",
            nav_health: "Santé",
            nav_firstaid: "Premiers Secours",
            btn_login: "Connexion",
            btn_register: "S'inscrire",
            notif_title: "Annonces & Infos",
            notif_tag1: "🚀 Mise à jour v2.4",
            notif_desc1: "Algorithme de suivi en direct et module de thérapie respiratoire mis à jour avec succès !",
            notif_tag2: "ℹ️ À Propos",
            notif_desc2: "Dumansız Gelecek est un assistant de suivi numérique gratuit conçu pour lutter contre la dépendance à la nicotine.",
            notif_tag3: "📲 Mobile",
            notif_desc3: "Téléchargez nos versions Android directement depuis les liens en bas de page.",
            profile_settings: "Paramètres du Profil",
            profile_logout: "Déconnexion",
            profile_hint: "Votre photo de profil est récupérée automatiquement depuis votre compte GitHub.",
            lbl_fullname: "Nom Complet",
            lbl_github_user: "Nom d'utilisateur GitHub",
            btn_save_update: "Enregistrer et Mettre à Jour",
            lbl_email: "Adresse E-mail",
            lbl_pass: "Mot de passe",
            btn_login_submit: "Se Connecter",
            or_divider: "OU",
            btn_github_login: "Se connecter avec GitHub",
            btn_google_login: "Se connecter avec Google",
            lbl_birthdate: "Date de Naissance",
            lbl_pass_confirm: "Confirmer le Mot de passe",
            lbl_kvkk: "J'ai lu et j'accepte les termes relatifs au traitement de mes données personnelles.",
            lbl_age_confirm: "Je confirme avoir plus de 18 ans.",
            btn_create_account: "Créer un Compte",
            btn_github_register: "S'inscrire avec GitHub",
            btn_google_register: "S'inscrire avec Google",
            hint_github_terms: "* Vous devez cocher les cases d'accord pour vous inscrire avec GitHub.",
            welcome_tolga: "Bonjour Je suis",
            desc_tolga: "Avec la vision du Mouvement Technologique National, nous continuons à développer ce projet pour protéger les jeunes et les familles.",
            tag_dev_tolga: "Développeur : Tolga Uysal",
            tag_category: "Catégorie : Santé & Premiers Secours",
            tag_tech: "Technologie pour l'Humanité",
            welcome_volkan: "Bonjour Je suis",
            desc_volkan: "Je suis le consultant du projet et partenaire de processus.",
            tag_dev_volkan: "Consultant : Volkan Mutlu",
            sim_title: "Simulation Utilisateur",
            sim_desc: "Chers membres du jury, testez les réponses du système en modifiant les valeurs.",
            lbl_username: "Nom d'utilisateur",
            lbl_quitdate: "Date d'arrêt",
            lbl_dailypacks: "Consommation Quotidienne",
            lbl_packcost: "Prix d'un Paquet (TL)",
            btn_update_sim: "Mettre à jour la Simulation",
            algo_working: "Algorithme en cours...",
            stat_smokefree_time: "Temps Sans Tabac",
            stat_smokefree_sub: "Pas vers la liberté",
            stat_money_saved: "Fortune Nationale Sauvée",
            stat_money_sub: "Contribution à l'économie",
            stat_cigs_avoided: "Cigarettes Évitées",
            stat_cigs_sub: "Poison évité",
            stat_life_gained: "Vie Gagnée",
            stat_life_sub: "Temps ajouté à la vie",
            stat_tar_avoided: "Goudron Évité",
            stat_tar_sub: "Poumons propres",
            stat_puffs_avoided: "Bouffées Évitées",
            stat_puffs_sub: "Air toxique bloqué",
            achieve_title: "Réalisations et Badges",
            achieve_desc: "Module de ludification récompensant les progrès.",
            health_title: "Algorithme de Régénération Corporelle",
            health_desc: "Carte de progression médicale en temps réel.",
            breathe_title: "Premiers Secours : Module de Respiration 4-7-8",
            breathe_desc: "Logiciel d'exercice apaisant les envies de nicotine.",
            breathe_start_hint: "Cliquez pour démarrer",
            breathe_ready: "Prêt",
            breathe_btn_start: "Démarrer",
            breathe_btn_stop: "Arrêter"
        }
    };

    // Sağlık Kilometre Taşları
    const healthMilestonesData = [
        { hours: 8, title: "Karbonmonoksit Seviyesi Düzelir", desc: "Kandaki oksijen seviyesi normal değerine döner.", icon: "fa-lungs" },
        { hours: 24, title: "Kalp Krizi Riski Azalır", desc: "Vücut nikotinden büyük ölçüde arınmaya başlar.", icon: "fa-heart" },
        { hours: 48, title: "Koku ve Tat Alma Duyusu Gelişir", desc: "Sinir uçları yeniden onarılmaya başlar.", icon: "fa-utensils" },
        { hours: 72, title: "Bronşlar Gevşer, Enerji Artar", desc: "Nefes almak belirgin şekilde kolaylaşır.", icon: "fa-wind" },
        { hours: 336, title: "Kan Dolaşımı Düzelir (1-3 Hafta)", desc: "Yürüme ve koşma kapasitesi artar.", icon: "fa-person-running" },
        { hours: 2160, title: "Öksürük ve Hırıltı Azalır (3 Ay)", desc: "Akciğer fonksiyonları %30'a varan oranda iyileşir.", icon: "fa-shield-heart" },
        { hours: 8760, title: "Koroner Kalp Hastalığı Riski Yarıya Düşer (1 Yıl)", desc: "Büyük bir sağlık engeli geride bırakıldı.", icon: "fa-award" }
    ];

    // Rozet Listesi
    const badgesList = [
        { id: 'b1', name: "İlk 24 Saat", desc: "Zorlu ilk günü geride bıraktın!", icon: "fa-medal", reqHours: 24 },
        { id: 'b2', name: "3 Gün Savaşçısı", desc: "Nikotinin vücuttan atıldığı kritik eşik.", icon: "fa-shield", reqHours: 72 },
        { id: 'b3', name: "1 Hafta Kahramanı", desc: "7 gün boyunca iradeni korudun.", icon: "fa-star", reqHours: 168 },
        { id: 'b4', name: "1 Ayın Ustası", desc: "30 günlük dev adımı tamamladın.", icon: "fa-trophy", reqHours: 720 },
        { id: 'b5', name: "Ekonomi Uzmanı", desc: "Bütçesini korumayı başaran bilinçli birey.", icon: "fa-wallet", reqHours: 48 }
    ];

    // --- Sayfa Yüklenme Olayı ---
    document.addEventListener('DOMContentLoaded', () => {
        applyConsentGateState();
        if (!hasCookieConsent()) {
            return;
        }
        initApplicationLogic();
    });

    function initApplicationLogic() {
        loadUserDataStorage();
        setupEventListenersHandlers();
        renderHealthTimelineView();
        renderBadgesView();
        startLiveTimerEngine();
        initGoogleAuthSafe();
    }

    // --- Simülasyon ve Sayaç Mantığı ---
    function startLiveTimerEngine() {
        if (timerInterval) clearInterval(timerInterval);
        updateStatisticsData();
        timerInterval = setInterval(updateStatisticsData, 1000);
    }

    function updateStatisticsData() {
        const quitDateElement = document.getElementById('quitDate');
        const dailyPacksElement = document.getElementById('dailyPacks');
        const packCostElement = document.getElementById('packCost');

        if (!quitDateElement) return;

        const quitDateStr = quitDateElement.value;
        const dailyPacks = Number.parseFloat(dailyPacksElement ? dailyPacksElement.value : 1) || 1;
        const packCost = Number.parseFloat(packCostElement ? packCostElement.value : 80) || 80;

        const quitDate = new Date(quitDateStr);
        const now = new Date();
        const diffMs = now.getTime() - quitDate.getTime();
        const diffSec = Math.max(0, Math.floor(diffMs / 1000));

        if (diffSec <= 0) {
            safeSetText('valTime', '0g 00s 00d 00sn');
            safeSetText('valMoney', '0.00 TL');
            safeSetText('valCount', '0 Adet');
            safeSetText('valLife', '0 Saat');
            safeSetText('valTar', '0 mg');
            safeSetText('valPuff', '0');
            return;
        }

        const secondsInDay = 86400;
        const secondsInHour = 3600;
        const secondsInMinute = 60;

        const totalDays = Math.floor(diffSec / secondsInDay);
        const totalHours = Math.floor((diffSec % secondsInDay) / secondsInHour);
        const totalMinutes = Math.floor((diffSec % secondsInHour) / secondsInMinute);
        const totalSeconds = diffSec % secondsInMinute;

        safeSetText('valTime', `${totalDays}g ${String(totalHours).padStart(2, '0')}s ${String(totalMinutes).padStart(2, '0')}d ${String(totalSeconds).padStart(2, '0')}sn`);

        const hoursElapsed = diffSec / secondsInHour;
        const daysElapsed = diffSec / secondsInDay;
        const moneySaved = daysElapsed * dailyPacks * packCost;
        const cigarettesAvoided = Math.floor(daysElapsed * dailyPacks * 20);
        const lifeGainedHours = Math.floor(cigarettesAvoided * 0.183);
        const tarAvoided = cigarettesAvoided * 12;
        const puffsAvoided = cigarettesAvoided * 10;

        safeSetText('valMoney', moneySaved.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL');
        safeSetText('valCount', cigarettesAvoided.toLocaleString('tr-TR') + ' Adet');
        safeSetText('valLife', lifeGainedHours.toLocaleString('tr-TR') + ' Saat');
        safeSetText('valTar', tarAvoided.toLocaleString('tr-TR') + ' mg');
        safeSetText('valPuff', puffsAvoided.toLocaleString('tr-TR'));

        checkBadgesProgressLogic(hoursElapsed);
        updateTimelineProgressState(hoursElapsed);
    }

    function safeSetText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) el.innerText = text;
    }

    window.saveConfig = function(showAlert = false) {
        const userName = document.getElementById('userName')?.value || '';
        const quitDate = document.getElementById('quitDate')?.value || '';
        const dailyPacks = document.getElementById('dailyPacks')?.value || '1';
        const packCost = document.getElementById('packCost')?.value || '80';

        const data = { userName, quitDate, dailyPacks, packCost };
        localStorage.setItem('dumansiz_config', JSON.stringify(data));
        startLiveTimerEngine();

        if (showAlert) {
            showNotificationCustom("Simülasyon başarıyla güncellendi!", "success");
        }
    }

    function loadUserDataStorage() {
        const saved = localStorage.getItem('dumansiz_config');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.userName) document.getElementById('userName').value = data.userName;
                if (data.quitDate) document.getElementById('quitDate').value = data.quitDate;
                if (data.dailyPacks) document.getElementById('dailyPacks').value = data.dailyPacks;
                if (data.packCost) document.getElementById('packCost').value = data.packCost;
            } catch (e) {
                console.error("Config parse error:", e);
            }
        } else {
            const defaultDate = new Date(Date.now() - 3 * 24 * 3600 * 1000);
            const qdEl = document.getElementById('quitDate');
            if (qdEl) qdEl.value = defaultDate.toISOString().slice(0, 16);
        }

        const activeUser = localStorage.getItem('dumansiz_active_user');
        if (activeUser) {
            try {
                const userObj = JSON.parse(activeUser);
                setLoggedInStateUI(userObj);
            } catch (e) {
                console.error("User parse error:", e);
            }
        }
    }

    // --- Zaman Çizelgesi Render ---
    function renderHealthTimelineView() {
        const container = document.getElementById('healthTimeline');
        if (!container) return;

        container.innerHTML = healthMilestonesData.map((m, index) => `
            <div class="timeline-item" id="timeline-item-${index}">
                <div class="timeline-dot"><i class="fa-solid ${m.icon}"></i></div>
                <div class="timeline-content">
                    <span class="timeline-time">${m.hours >= 24 ? (m.hours / 24) + ' Gün' : m.hours + ' Saat'} Sonra</span>
                    <h4>${m.title}</h4>
                    <p>${m.desc}</p>
                </div>
            </div>
        `).join('');
    }

    function updateTimelineProgressState(currentHours) {
        healthMilestonesData.forEach((m, index) => {
            const item = document.getElementById(`timeline-item-${index}`);
            if (!item) return;
            if (currentHours >= m.hours) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    }

    // --- Rozetler Render ---
    function renderBadgesView() {
        const container = document.getElementById('badgeContainer');
        if (!container) return;

        container.innerHTML = badgesList.map(b => `
            <div class="badge-card locked" id="badge-${b.id}">
                <div class="badge-icon"><i class="fa-solid ${b.icon}"></i></div>
                <h4>${b.name}</h4>
                <p>${b.desc}</p>
            </div>
        `).join('');
    }

    function checkBadgesProgressLogic(currentHours) {
        badgesList.forEach(b => {
            const card = document.getElementById(`badge-${b.id}`);
            if (!card) return;
            if (currentHours >= b.reqHours) {
                card.classList.remove('locked');
                card.classList.add('unlocked');
            }
        });
    }

    // --- Modal Yönetimi ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'flex';
    }

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    function setupEventListenersHandlers() {
        const kvkkCheckbox = document.getElementById('regKvkk');
        const ageCheckbox = document.getElementById('regAgeConfirm');
        const githubRegBtn = document.getElementById('githubRegisterBtn');
        const githubHint = document.getElementById('githubBtnHint');

        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                if (modal.style.display !== 'none') closeModal(modal.id);
            });
            document.getElementById('notifDropdown')?.classList.remove('show');
            document.getElementById('profileDropdown')?.classList.remove('open');
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', event => {
                if (event.target === modal) closeModal(modal.id);
            });
        });

        function validateRegCheckboxes() {
            if (!kvkkCheckbox || !ageCheckbox || !githubRegBtn) return;
            if (kvkkCheckbox.checked && ageCheckbox.checked) {
                githubRegBtn.classList.remove('disabled');
                githubRegBtn.setAttribute('aria-disabled', 'false');
                if (githubHint) githubHint.style.display = 'none';
            } else {
                githubRegBtn.classList.add('disabled');
                githubRegBtn.setAttribute('aria-disabled', 'true');
                if (githubHint) githubHint.style.display = 'block';
            }
        }

        if (kvkkCheckbox && ageCheckbox) {
            kvkkCheckbox.addEventListener('change', validateRegCheckboxes);
            ageCheckbox.addEventListener('change', validateRegCheckboxes);
        }
    }

    // --- Kimlik Doğrulama İşlemleri ---
    window.handleLogin = function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail')?.value || 'user@test.com';
        const password = document.getElementById('loginPass')?.value || '';
        const savedAccount = JSON.parse(localStorage.getItem('dumansiz_account') || 'null');

        if (!password) {
            showNotificationCustom("Lütfen şifrenizi girin.", "error");
            return;
        }

        if (savedAccount && (savedAccount.email !== email || savedAccount.password !== password)) {
            showNotificationCustom("E-posta veya şifre hatalı.", "error");
            return;
        }

        const userName = email.split('@')[0];
        
        const userData = { name: userName, email: email, avatar: "https://github.com/identicons/" + userName + ".png" };
        localStorage.setItem('dumansiz_active_user', JSON.stringify(userData));
        
        setLoggedInStateUI(userData);
        closeModal('loginModal');
        showNotificationCustom("Başarıyla giriş yapıldı!", "success");
    }

    window.handleRegister = function(event) {
        event.preventDefault();
        const name = document.getElementById('regName')?.value || 'Yeni Kullanıcı';
        const email = document.getElementById('regEmail')?.value || 'user@test.com';
        const password = document.getElementById('regPass')?.value || '';
        const passwordConfirm = document.getElementById('regPassConfirm')?.value || '';

        if (password !== passwordConfirm) {
            showNotificationCustom("Şifreler eşleşmiyor.", "error");
            document.getElementById('regPassConfirm')?.focus();
            return;
        }
        
        const userData = { name: name, email: email, avatar: "https://github.com/identicons/" + name.replace(/\s+/g, '') + ".png" };
        localStorage.setItem('dumansiz_account', JSON.stringify({ name, email, password }));
        localStorage.setItem('dumansiz_active_user', JSON.stringify(userData));
        
        setLoggedInStateUI(userData);
        closeModal('registerModal');
        showNotificationCustom("Hesabınız başarıyla oluşturuldu!", "success");
    }

    window.handleLogout = function() {
        localStorage.removeItem('dumansiz_active_user');
        const authButtons = document.getElementById('authButtons');
        const userProfileMenu = document.getElementById('userProfileMenu');
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfileMenu) userProfileMenu.style.display = 'none';
        
        const overlay = document.getElementById('authOverlay');
        const content = document.getElementById('geminiContent');
        if (overlay) overlay.style.display = 'flex';
        if (content) content.classList.add('blur-content');

        showNotificationCustom("Oturum kapatıldı.", "info");
    }

    function setLoggedInStateUI(userObj) {
        const authButtons = document.getElementById('authButtons');
        const userProfileMenu = document.getElementById('userProfileMenu');
        if (authButtons) authButtons.style.display = 'none';
        if (userProfileMenu) userProfileMenu.style.display = 'block';
        
        safeSetText('navUserName', userObj.name);
        const imgEl = document.getElementById('navProfileImg');
        if (imgEl && userObj.avatar) {
            imgEl.src = userObj.avatar;
        }

        const overlay = document.getElementById('authOverlay');
        const content = document.getElementById('geminiContent');
        if (overlay) overlay.style.display = 'none';
        if (content) content.classList.remove('blur-content');
    }

    window.toggleProfileDropdown = function() {
        const dropdown = document.getElementById('profileDropdown');
        const trigger = document.getElementById('profileTrigger');
        if (!dropdown) return;
        const isOpen = dropdown.classList.contains('open');
        
        if (isOpen) {
            dropdown.classList.remove('open');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        } else {
            dropdown.classList.add('open');
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
        }
    }

    window.openProfileSettings = function() {
        toggleProfileDropdown();
        const activeUser = JSON.parse(localStorage.getItem('dumansiz_active_user') || '{}');
        const editNameEl = document.getElementById('editProfileName');
        if (editNameEl) editNameEl.value = activeUser.name || '';
        const previewEl = document.getElementById('modalProfilePreview');
        if (previewEl && activeUser.avatar) {
            previewEl.src = activeUser.avatar;
        }
        openModal('profileModal');
    }

    window.updateGithubPreview = function(username) {
        if (!username) return;
        const previewImg = document.getElementById('modalProfilePreview');
        if (previewImg) {
            previewImg.src = `https://github.com/${username}.png`;
        }
    }

    window.saveProfileSettings = function(event) {
        event.preventDefault();
        const newName = document.getElementById('editProfileName')?.value || 'Tolga';
        const ghUser = document.getElementById('editGithubUsername')?.value || '';
        
        let activeUser = JSON.parse(localStorage.getItem('dumansiz_active_user') || '{}');
        activeUser.name = newName;
        if (ghUser) {
            activeUser.avatar = `https://github.com/${ghUser}.png`;
        }
        
        localStorage.setItem('dumansiz_active_user', JSON.stringify(activeUser));
        setLoggedInStateUI(activeUser);
        closeModal('profileModal');
        showNotificationCustom("Profil ayarları güncellendi!", "success");
    }

    // --- Google Sign-In Entegrasyonu (GSI Fixed Width Error Handled) ---
    function initGoogleAuthSafe() {
        const clientId = document.querySelector('meta[name="google-client-id"]')?.content.trim();
        const loginContainer = document.getElementById('googleLoginButtonLogin');
        const registerContainer = document.getElementById('googleLoginButtonRegister');

        if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
            [loginContainer, registerContainer].forEach(container => {
                if (container) {
                    container.textContent = 'Google ile giriş şu anda yapılandırılmamış.';
                    container.classList.add('google-auth-unavailable');
                }
            });
            return;
        }

        if (typeof google === 'undefined' || !google.accounts?.id) return;

        try {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleResponseCallback
            });

            [loginContainer, registerContainer].forEach(container => {
                if (container && container.childElementCount === 0) {
                    google.accounts.id.renderButton(container, { theme: 'outline', size: 'large', width: 280 });
                }
            });
        } catch (error) {
            console.warn('Google ile giriş başlatılamadı:', error.message);
        }
    }

    function handleGoogleResponseCallback(response) {
        const responsePayload = parseJwtTokenCustom(response.credential);
        const userData = {
            name: responsePayload.name,
            email: responsePayload.email,
            avatar: responsePayload.picture
        };
        localStorage.setItem('dumansiz_active_user', JSON.stringify(userData));
        setLoggedInStateUI(userData);
        closeModal('loginModal');
        closeModal('registerModal');
        showNotificationCustom("Google ile başarıyla giriş yapıldı!", "success");
    }

    function parseJwtTokenCustom(token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return { name: "Google Kullanıcı", email: "user@gmail.com", picture: "https://github.com/identicons/google.png" };
        }
    }

    // --- 4-7-8 Nefes Terapisi Modülü ---
    const btnStartBreathe = document.getElementById('btnStartBreathe');
    const btnStopBreathe = document.getElementById('btnStopBreathe');
    const breatheText = document.getElementById('breatheText');
    const breatheCircle = document.getElementById('breatheCircle');

    if (btnStartBreathe) {
        btnStartBreathe.addEventListener('click', startBreatheSessionRoutine);
    }
    if (btnStopBreathe) {
        btnStopBreathe.addEventListener('click', stopBreatheSessionRoutine);
    }

    function startBreatheSessionRoutine() {
        if (breatheInterval) return;
        runBreatheCycleRoutine();
        breatheInterval = setInterval(runBreatheCycleRoutine, 19000); 
    }

    function stopBreatheSessionRoutine() {
        if (breatheInterval) {
            clearInterval(breatheInterval);
            breatheInterval = null;
        }
        if (breatheText) breatheText.innerText = "Egzersiz durduruldu.";
        if (breatheCircle) {
            breatheCircle.innerText = "Hazır";
            breatheCircle.style.transform = "scale(1.0)";
            breatheCircle.style.borderColor = "var(--primary-color, #00d26a)";
        }
    }

    function runBreatheCycleRoutine() {
        if (breatheText) breatheText.innerText = "Nefes Al (4 saniye)";
        if (breatheCircle) {
            breatheCircle.innerText = "4";
            breatheCircle.style.transform = "scale(1.3)";
            breatheCircle.style.borderColor = "#00d26a";
        }

        setTimeout(() => {
            if (breatheText) breatheText.innerText = "Nefesini Tut (7 saniye)";
            if (breatheCircle) breatheCircle.innerText = "7";
        }, 4000);

        setTimeout(() => {
            if (breatheText) breatheText.innerText = "Yavaşça Ver (8 saniye)";
            if (breatheCircle) {
                breatheCircle.innerText = "8";
                breatheCircle.style.transform = "scale(1.0)";
                breatheCircle.style.borderColor = "#ff5252";
            }
        }, 11000);
    }

    // --- Dil Değiştirici ---
    window.changeLanguage = function(lang) {
        currentLang = lang;
        
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`lang-${lang}`);
        if (activeBtn) activeBtn.classList.add('active');

        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });
    }

    // --- Bildirim Yardımcısı ---
    function showNotificationCustom(message, type = "info") {
        const notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '20px';
        notif.style.right = '20px';
        notif.style.padding = '12px 20px';
        notif.style.background = type === 'success' ? '#00d26a' : '#1e293b';
        notif.style.color = type === 'success' ? '#121824' : '#fff';
        notif.style.borderRadius = '8px';
        notif.style.fontWeight = '600';
        notif.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
        notif.style.zIndex = '9999';
        notif.style.transition = 'all 0.3s ease';
        notif.innerText = message;

        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    window.toggleNotifDropdown = function() {
        const dropdown = document.getElementById('notifDropdown');
        if (dropdown) dropdown.classList.toggle('show');
    }

    window.closeBanner = function() {
        const banner = document.getElementById('teknofestBanner');
        if (banner) banner.style.display = 'none';
    }
}
