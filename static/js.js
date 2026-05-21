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
    const contactSection = document.getElementById('contactSection');
    const contactBtn = document.getElementById('contactes');
    const closeContactBtn = document.getElementById('closeContactBtn');
    
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    const searchInput = document.querySelector('.SearchForProducts');
    const productsContainer = document.getElementById('prodacte');

    let lastActiveSection = userSection;
    let selectedProductName = ''; // لتخزين اسم المنتج المختار

    // --- جلب المنتجات من الواجهة الخلفية ---
    async function fetchProducts() {
        try {
            // استخدام مسار نسبي لكي يعمل على أي دومين
            const response = await fetch('/api/products/');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            if(productsContainer) productsContainer.innerHTML = '<p style="color:red; text-align:center;">عذراً، تعذر الاتصال بالخادم.</p>';
        }
    }

    function renderProducts(products) {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
            // استخدام رابط الصورة من السيرفر، أو صورة افتراضية
            const imageUrl = product.image ? product.image : '/static/logo.jpg';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${imageUrl}" alt="${product.name}" class="imgProdact">
                </div>
                <div class="card-content-wrapper">
                    <h1 class="titleOfProdacte">${product.name}</h1>
                    <p class="paragraphOfProdacte">${product.description}</p>
                    <p class="price" style="color: #64ffda; font-weight: bold;">${product.price} $</p>
                    <button class="bayProdact">شراء</button>
                </div>
            `;
            productsContainer.appendChild(card);

            card.querySelector('.bayProdact').addEventListener('click', () => {
                selectedProductName = product.name; // حفظ اسم المنتج عند الضغط على شراء
                if(orderSection) orderSection.style.display = 'flex';
            });
        });
        
        const currentLang = localStorage.getItem('siteLang') || 'ar';
        applyLanguage(currentLang);
    }

    fetchProducts();

    // --- محرك البحث ---
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const title = card.querySelector('.titleOfProdacte').textContent.toLowerCase();
                const desc = card.querySelector('.paragraphOfProdacte').textContent.toLowerCase();
                card.style.display = (title.includes(term) || desc.includes(term)) ? 'flex' : 'none';
            });
        });
    }

    // --- إضافة منتج جديد من لوحة التحكم (FormData لرفع الملفات) ---
    const addProductForm = document.getElementById('addProductForm');
    if(addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('name', document.getElementById('newProdTitle').value);
            formData.append('description', document.getElementById('newProdDesc').value);
            formData.append('price', document.getElementById('newProdPrice').value);
            
            const imageFile = document.getElementById('newProdImage').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            try {
                const response = await fetch('/api/products/', {
                    method: 'POST',
                    body: formData
                });
                if(response.ok) {
                    alert('تم إضافة المنتج بنجاح مع الصورة!');
                    addProductForm.reset();
                    fetchProducts();
                } else {
                    alert('حدث خطأ أثناء الإضافة.');
                }
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });
    }

    // --- إرسال طلب شراء إلى السيرفر ---
    const purchaseForm = document.getElementById('purchaseForm');
    if(purchaseForm) {
        purchaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const orderData = {
                customer_name: document.getElementById('custName').value,
                customer_phone: document.getElementById('custPhone').value,
                customer_address: document.getElementById('custAddress').value,
                product_name: selectedProductName // إرسال اسم المنتج المختار
            };

            try {
                const response = await fetch('/api/orders/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                if(response.ok) {
                    alert('تم تأكيد طلبك بنجاح! سنتواصل معك قريباً.');
                    purchaseForm.reset();
                    if(orderSection) orderSection.style.display = 'none';
                }
            } catch (error) {
                console.error('Error submitting order:', error);
            }
        });
    }

    // --- قاموس الترجمة ---
    const translations = {
        ar: {
            dir: 'rtl', admin: 'الإدارة', store: 'المتجر', settingsLabel: 'الإعدادات', search: 'ابحث عن منتج...',
            buy: 'شراء', loginTitle: 'دخول المسؤول', userPlaceholder: 'اسم المستخدم', passPlaceholder: 'كلمة المرور',
            loginBtn: 'دخول', adminPanel: 'لوحة التحكم', dash: 'الرئيسية', orders: 'الطلبات', stats: 'الإحصائيات',
            orderTitle: 'إتمام الطلب', confirm: 'تأكيد الشراء', cancel: 'إلغاء'
        },
        fr: {
            dir: 'ltr', admin: 'Admin', store: 'Boutique', settingsLabel: 'Paramètres', search: 'Rechercher...',
            buy: 'Acheter', loginTitle: 'Connexion Admin', userPlaceholder: 'Nom d\'utilisateur', passPlaceholder: 'Mot de passe',
            loginBtn: 'Entrer', adminPanel: 'Panneau d\'administration', dash: 'Tableau de bord', orders: 'Commandes',
            stats: 'Statistiques', orderTitle: 'Passer la commande', confirm: 'Confirmer', cancel: 'Annuler'
        },
        en: {
            dir: 'ltr', admin: 'Admin', store: 'Store', settingsLabel: 'Settings', search: 'Search for products...',
            buy: 'Buy Now', loginTitle: 'Admin Login', userPlaceholder: 'Username', passPlaceholder: 'Password',
            loginBtn: 'Login', adminPanel: 'Admin Panel', dash: 'Dashboard', orders: 'Orders',
            stats: 'Statistics', orderTitle: 'Checkout', confirm: 'Confirm', cancel: 'Cancel'
        }
    };

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

    const savedLang = localStorage.getItem('siteLang') || 'ar';
    const savedMode = localStorage.getItem('siteMode') || 'dark';

    const langSelect = document.getElementById('langSelect');
    if(langSelect) {
        langSelect.value = savedLang;
        applyLanguage(savedLang);
    }
    applyThemeStyles(savedMode === 'light');

    function hideAllSections() {
        if(userSection) userSection.style.display = 'none';
        if(adminSection) adminSection.style.display = 'none';
        if(loginSection) loginSection.style.display = 'none';
        if(settingsMenu) settingsMenu.style.display = 'none';
        if(orderSection) orderSection.style.display = 'none';
        if(contactSection) contactSection.style.display = 'none';
    }

    if(contactBtn) {
        contactBtn.addEventListener('click', () => {
            hideAllSections();
            if(contactSection) contactSection.style.display = 'flex';
        });
    }

    if(closeContactBtn) {
        closeContactBtn.addEventListener('click', () => {
            if(contactSection) contactSection.style.display = 'none';
            if(header) header.style.display = 'flex';
            if(mainNav) {
                mainNav.style.display = (window.innerWidth <= 1024) ? 'grid' : 'flex';
            }
            if(lastActiveSection) lastActiveSection.style.display = 'block';
        });
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
            if(mainNav) mainNav.style.display = 'none';
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
                mainNav.style.display = (window.innerWidth <= 1024) ? 'grid' : 'flex';
            }
            if(lastActiveSection) lastActiveSection.style.display = 'block';
        });
    }

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

    const toggleBtn = document.getElementById('ldMode');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isLight = !document.body.classList.contains('light-mode');
            applyThemeStyles(isLight);
            localStorage.setItem('siteMode', isLight ? 'light' : 'dark');
        });
    }

    if(langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            applyLanguage(lang);
            localStorage.setItem('siteLang', lang);
        });
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // --- منطق حذف المنتج ---
    const openDeleteModalBtn = document.getElementById('openDeleteModalBtn');
    const deleteProductModal = document.getElementById('deleteProductModal');
    const deleteProdSelect = document.getElementById('deleteProdSelect');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const closeDeleteBtn = document.getElementById('closeDeleteBtn');

    if(openDeleteModalBtn) {
        openDeleteModalBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/products/');
                const products = await response.json();
                
                deleteProdSelect.innerHTML = '';
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.name;
                    deleteProdSelect.appendChild(option);
                });
                
                deleteProductModal.style.display = 'flex';
            } catch (error) {
                console.error('Error fetching products for delete:', error);
                alert('تعذر جلب قائمة المنتجات.');
            }
        });
    }

    if(confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            const productId = deleteProdSelect.value;
            if(!productId) return;

            if(!confirm('هل أنت متأكد تماماً من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) return;

            try {
                const response = await fetch(`/api/products/${productId}/`, {
                    method: 'DELETE'
                });
                
                if(response.ok) {
                    alert('تم حذف المنتج بنجاح.');
                    deleteProductModal.style.display = 'none';
                    fetchProducts(); 
                } else {
                    alert('حدث خطأ أثناء محاولة الحذف.');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('فشل الاتصال بالسيرفر لحذف المنتج.');
            }
        });
    }

    if(closeDeleteBtn) {
        closeDeleteBtn.addEventListener('click', () => {
            deleteProductModal.style.display = 'none';
        });
    }

    // --- جلب الطلبات من الواجهة الخلفية (للمسؤول) ---
    const ordersList = document.getElementById('ordersList');
    const orderDetailModal = document.getElementById('orderDetailModal');
    const orderDetailContent = document.getElementById('orderDetailContent');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const resetOrdersBtn = document.getElementById('resetOrdersBtn');
    const resetStatsBtn = document.getElementById('resetStatsBtn');

    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders/');
            const orders = await response.json();
            renderOrders(orders);
            
            const prodResp = await fetch('/api/products/');
            const products = await prodResp.json();
            updateStats(orders, products);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderOrders(orders) {
        if (!ordersList) return;
        ordersList.innerHTML = '';
        if (orders.length === 0) {
            ordersList.innerHTML = '<p style="text-align:center;">لا توجد طلبات حالياً.</p>';
            return;
        }
        orders.forEach(order => {
            const btn = document.createElement('button');
            btn.className = 'adminBtn';
            btn.style.margin = '5px 0';
            btn.style.width = '100%';
            btn.style.textAlign = 'right';
            btn.textContent = `🛒 طلب لـ (${order.product_name}) من: ${order.customer_name}`;
            btn.addEventListener('click', () => showOrderDetail(order));
            ordersList.appendChild(btn);
        });
    }

    function showOrderDetail(order) {
        if (!orderDetailContent || !orderDetailModal) return;
        orderDetailContent.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; line-height: 1.8;">
                <p><strong>📦 المنتج المطلوب:</strong> ${order.product_name}</p>
                <p><strong>👤 اسم العميل:</strong> ${order.customer_name}</p>
                <p><strong>📞 رقم الهاتف:</strong> ${order.customer_phone}</p>
                <p><strong>📍 العنوان:</strong> ${order.customer_address}</p>
                <p><strong>📅 تاريخ الطلب:</strong> ${new Date(order.created_at).toLocaleString('ar-EG')}</p>
            </div>
        `;
        orderDetailModal.style.display = 'flex';
    }

    function updateStats(orders, products) {
        document.getElementById('totalProductsCount').textContent = products.length;
        document.getElementById('orderCountStat').textContent = orders.length;

        // حساب الأرباح والخسائر
        let totalProfit = 0;
        orders.forEach(order => {
            const product = products.find(p => p.name === order.product_name);
            if (product) {
                const profit = parseFloat(product.price) - parseFloat(product.cost_price);
                totalProfit += profit;
            }
        });

        const profitElem = document.getElementById('profitStat');
        profitElem.textContent = `${totalProfit.toFixed(2)} $`;
        profitElem.style.color = totalProfit >= 0 ? '#64ffda' : '#ff4d4d';
    }

    if(resetOrdersBtn) {
        resetOrdersBtn.addEventListener('click', async () => {
            if(!confirm('هل أنت متأكد من مسح جميع الطلبات نهائياً؟')) return;
            try {
                const response = await fetch('/api/orders/');
                const orders = await response.json();
                for (let order of orders) {
                    await fetch(`/api/orders/${order.id}/`, { method: 'DELETE' });
                }
                alert('تم تصفير الطلبات بنجاح.');
                fetchOrders();
            } catch (e) { console.error(e); }
        });
    }

    if(resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            if(!confirm('هل تريد تصفير عرض الإحصائيات مؤقتاً؟ (لن يحذف البيانات من السيرفر)')) return;
            document.getElementById('totalProductsCount').textContent = '0';
            document.getElementById('orderCountStat').textContent = '0';
            document.getElementById('profitStat').textContent = '0.00 $';
        });
    }

    if(closeDetailBtn) {
        closeDetailBtn.addEventListener('click', () => {
            orderDetailModal.style.display = 'none';
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // جلب البيانات عند فتح تبويب الطلبات أو الإحصائيات
            if (tabId === 'orders' || tabId === 'stats') {
                fetchOrders();
            }

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(content => {
                content.classList.toggle('active', content.id === tabId);
            });
        });
    });

    const closeOrderBtn = document.getElementById('closeOrderBtn');
    if(closeOrderBtn) {
        closeOrderBtn.addEventListener('click', () => {
            if(orderSection) orderSection.style.display = 'none';
        });
    }
});