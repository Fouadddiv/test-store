document.addEventListener('DOMContentLoaded', () => {
    // --- تعريف المتغيرات والعناصر الرئيسية ---
    const header = document.querySelector('header');
    const mainNav = document.querySelector('.nav');
    
    const adminNavBtn = document.getElementById('root'); 
    const userNavBtn = document.getElementById('ui');    
    const settingsBtn = document.getElementById('settingsBtn'); 
    
    const userSection = document.getElementById('userSection');
    const loginSection = document.getElementById('loginSection');
    const adminSection = document.getElementById('adminSection');
    const settingsMenu = document.getElementById('settingsMenu');
    const orderSection = document.getElementById('orderSection');
    
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    const searchInput = document.querySelector('.SearchForProducts');
    const productCards = document.querySelectorAll('.card');

    let lastActiveSection = userSection; // لتذكر القسم الذي كان مفتوحاً قبل الإعدادات

    // --- قاموس الترجمة للغات الثلاث ---
    const translations = {
        ar: {
            dir: 'rtl',
            admin: 'الإدارة',
            store: 'المتجر',
            settingsLabel: 'الإعدادات',
            search: 'ابحث عن منتج...',
            buy: 'شراء',
            loginTitle: 'دخول المسؤول',
            userPlaceholder: 'اسم المستخدم',
            passPlaceholder: 'كلمة المرور',
            loginBtn: 'دخول',
            adminPanel: 'لوحة التحكم',
            dash: 'الرئيسية',
            orders: 'الطلبات',
            stats: 'الإحصائيات',
            orderTitle: 'إتمام الطلب',
            confirm: 'تأكيد الشراء',
            cancel: 'إلغاء'
        },
        fr: {
            dir: 'ltr',
            admin: 'Admin',
            store: 'Boutique',
            settingsLabel: 'Paramètres',
            search: 'Rechercher...',
            buy: 'Acheter',
            loginTitle: 'Connexion Admin',
            userPlaceholder: 'Nom d\'utilisateur',
            passPlaceholder: 'Mot de passe',
            loginBtn: 'Entrer',
            adminPanel: 'Panneau d\'administration',
            dash: 'Tableau de bord',
            orders: 'Commandes',
            stats: 'Statistiques',
            orderTitle: 'Passer la commande',
            confirm: 'Confirmer',
            cancel: 'Annuler'
        },
        en: {
            dir: 'ltr',
            admin: 'Admin',
            store: 'Store',
            settingsLabel: 'Settings',
            search: 'Search for products...',
            buy: 'Buy Now',
            loginTitle: 'Admin Login',
            userPlaceholder: 'Username',
            passPlaceholder: 'Password',
            loginBtn: 'Login',
            adminPanel: 'Admin Panel',
            dash: 'Dashboard',
            orders: 'Orders',
            stats: 'Statistics',
            orderTitle: 'Checkout',
            confirm: 'Confirm',
            cancel: 'Cancel'
        }
    };

    // --- دالة تطبيق الترجمة ---
    function applyLanguage(lang) {
        const t = translations[lang] || translations['ar'];
        document.documentElement.lang = lang;
        document.documentElement.dir = t.dir;
        
        if(adminNavBtn) adminNavBtn.textContent = t.admin;
        if(userNavBtn) userNavBtn.textContent = t.store;
        if(settingsBtn) settingsBtn.setAttribute('aria-label', t.settingsLabel);
        if(searchInput) searchInput.placeholder = t.search;
        
        document.querySelectorAll('.bayProdact').forEach(btn => btn.textContent = t.buy);
        
        const loginH1 = document.querySelector('#loginSection h1');
        if(loginH1) loginH1.textContent = t.loginTitle;
        if(usernameInput) usernameInput.placeholder = t.userPlaceholder;
        if(passwordInput) passwordInput.placeholder = t.passPlaceholder;
        if(loginBtn) loginBtn.textContent = t.loginBtn;

        const adminH1 = document.querySelector('#adminSection h1');
        if(adminH1) adminH1.textContent = t.adminPanel;
        
        const dBtn = document.querySelector('[data-tab="dashboard"]');
        if(dBtn) dBtn.textContent = t.dash;
        const oBtn = document.querySelector('[data-tab="orders"]');
        if(oBtn) oBtn.textContent = t.orders;
        const sBtn = document.querySelector('[data-tab="stats"]');
        if(sBtn) sBtn.textContent = t.stats;

        const orderH2 = document.querySelector('#orderSection h2');
        if(orderH2) orderH2.textContent = t.orderTitle;
        
        const cName = document.getElementById('custName');
        if(cName) cName.placeholder = t.dir === 'rtl' ? 'الاسم الكامل' : 'Full Name';
        
        const pBtn = document.querySelector('#purchaseForm button[type="submit"]');
        if(pBtn) pBtn.textContent = t.confirm;
        
        const closeOBtn = document.getElementById('closeOrderBtn');
        if(closeOBtn) closeOBtn.textContent = t.cancel;
    }

    // --- دالة تطبيق الوضع اللوني ---
    function applyThemeStyles(isLight) {
        if (isLight) {
            document.body.classList.add('light-mode');
            document.body.style.backgroundColor = '#fff';
            document.body.style.color = '#000';
        } else {
            document.body.classList.remove('light-mode');
            document.body.style.backgroundColor = '#000';
            document.body.style.color = '#fff';
        }
        document.querySelectorAll('.login-container').forEach(c => {
            c.style.backgroundColor = isLight ? '#f0f0f0' : '#0A192F';
        });
    }

    // --- تحميل الإعدادات من Local Storage ---
    const savedLang = localStorage.getItem('siteLang') || 'ar';
    const savedMode = localStorage.getItem('siteMode') || 'dark';

    const langSelect = document.getElementById('langSelect');
    if(langSelect) {
        langSelect.value = savedLang;
        applyLanguage(savedLang);
    }
    applyThemeStyles(savedMode === 'light');

    // --- منطق التنقل بين الأقسام ---
    function hideAllSections() {
        if(userSection) userSection.style.display = 'none';
        if(adminSection) adminSection.style.display = 'none';
        if(loginSection) loginSection.style.display = 'none';
        if(settingsMenu) settingsMenu.style.display = 'none';
        if(orderSection) orderSection.style.display = 'none';
    }

    if(adminNavBtn) {
        adminNavBtn.addEventListener('click', () => {
            hideAllSections();
            loginSection.style.display = 'block';
            lastActiveSection = loginSection;
        });
    }

    if(userNavBtn) {
        userNavBtn.addEventListener('click', () => {
            hideAllSections();
            userSection.style.display = 'block';
            lastActiveSection = userSection;
        });
    }

    if(settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if(header) header.style.display = 'none';
            // إذا كان الـ nav داخل الهيدر سيختفي معه، ولكن للضمان:
            if(mainNav) mainNav.style.display = 'none';
            
            // بدلاً من إخفاء main بالكامل، نخفي الأقسام النشطة فقط
            hideAllSections();
            if(settingsMenu) settingsMenu.style.display = 'flex';
        });
    }

    const closeSettings = document.getElementById('closeSettings');
    if(closeSettings) {
        closeSettings.addEventListener('click', () => {
            if(settingsMenu) settingsMenu.style.display = 'none';
            if(header) header.style.display = 'flex';
            if(mainNav) {
                // استعادة التنسيق بناءً على حجم الشاشة
                mainNav.style.display = (window.innerWidth <= 1024) ? 'grid' : 'flex';
            }
            // العودة للقسم الأخير
            if(lastActiveSection) lastActiveSection.style.display = 'block';
        });
    }

    // --- منطق تسجيل الدخول ---
    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (usernameInput.value === 'admin' && passwordInput.value === 'admin') {
                loginSection.style.display = 'none';
                adminSection.style.display = 'block';
                lastActiveSection = adminSection;
                loginError.style.display = 'none';
            } else {
                if(loginError) loginError.style.display = 'block';
            }
        });
    }

    // --- محرك البحث ---
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            productCards.forEach(card => {
                const title = card.querySelector('.titleOfProdacte').textContent.toLowerCase();
                const desc = card.querySelector('.paragraphOfProdacte').textContent.toLowerCase();
                card.style.display = (title.includes(term) || desc.includes(term)) ? 'flex' : 'none';
            });
        });
    }

    // --- تبديل الوضع اللوني ---
    const toggleBtn = document.getElementById('ldMode');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isLight = !document.body.classList.contains('light-mode');
            applyThemeStyles(isLight);
            localStorage.setItem('siteMode', isLight ? 'light' : 'dark');
        });
    }

    // --- تغيير اللغة ---
    if(langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            applyLanguage(lang);
            localStorage.setItem('siteLang', lang);
        });
    }

    // --- تبويبات الإدارة ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(content => {
                content.classList.toggle('active', content.id === tabId);
            });
        });
    });

    // --- الشراء ---
    document.querySelectorAll('.bayProdact').forEach(btn => {
        btn.addEventListener('click', () => {
            if(orderSection) orderSection.style.display = 'flex';
        });
    });

    const closeOrderBtn = document.getElementById('closeOrderBtn');
    if(closeOrderBtn) {
        closeOrderBtn.addEventListener('click', () => {
            if(orderSection) orderSection.style.display = 'none';
        });
    }
});