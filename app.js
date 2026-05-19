document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const banner = document.getElementById('install-banner');
        if(banner) banner.style.display = 'flex';
    });

    const installBtn = document.getElementById('install-btn');
    if(installBtn) {
        installBtn.addEventListener('click', async () => {
            const banner = document.getElementById('install-banner');
            banner.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            }
        });
    }

    const app = document.getElementById('app');

    const defaultData = {
        products: [],
        orders: [],
        settings: {
            ownerPhone: "+923364459040",
            salesmanName: "داؤد سیلز"
        }
    };

    if (!localStorage.getItem('dawood_data')) {
        localStorage.setItem('dawood_data', JSON.stringify(defaultData));
    }

    window.state = {
        data: JSON.parse(localStorage.getItem('dawood_data')),
        currentScreen: 'dashboard',
        cart: [],
        orderForm: { shopName: '', shopPhone: '', address: '' },
        modal: null,
        tempProduct: { name: '', category: '', variants: [] },
        tempOrderSelection: { productIndex: -1, variant: '', qty: 1, isCustom: false }
    };
    const state = window.state;

    // Ensure settings exists
    if (!state.data.settings) {
        state.data.settings = {};
    }
    if (!state.data.settings.language) {
        state.data.settings.language = 'ur';
    }

    const i18n = {
        ur: {
            dashboard: "ڈیش بورڈ",
            installApp: "⬇ ایپ ڈاؤن لوڈ کریں",
            totalOrders: "کل آرڈرز",
            totalItems: "کل آئٹمز",
            pending: "پینڈنگ",
            delivered: "ڈیلیورڈ",
            recentOrders: "حالیہ آرڈرز",
            noOrdersYet: "ابھی تک کوئی آرڈر بک نہیں ہوا۔ بکنگ شروع کریں!",
            itemsCount: (count) => `${count} آئٹمز`,
            itemsInventory: "سامان کی لسٹ",
            addNewItem: "+ نیا آئٹم شامل کریں",
            noItemsAvailable: "کوئی آئٹم موجود نہیں ہے۔ براہ کرم نیا آئٹم شامل کریں۔",
            deleteConfirm: "کیا آپ اس آئٹم کو ڈیلیٹ کرنا چاہتے ہیں؟",
            variantsLabel: "سائز / پیکنگ",
            orderHistory: "آرڈر ہسٹری",
            noOrdersHistory: "ابھی تک کوئی آرڈر نہیں ہے۔",
            qtyLabel: "تعداد",
            settings: "سیٹنگز",
            salesmanName: "سیلزمین کا نام",
            ownerPhone: "مالک کا واٹس ایپ نمبر",
            phoneHint: "ملک کے کوڈ کے ساتھ لکھیں جیسے +923364459040",
            resetBtn: "ایپ کا تمام ڈیٹا ڈیلیٹ کریں",
            resetConfirm: "کیا آپ واقعی تمام ڈیٹا ڈیلیٹ کرنا چاہتے ہیں؟",
            createOrder: "نیا آرڈر بک کریں",
            shopNameLabel: "دکان کا نام *",
            shopNamePlaceholder: "دکان کا نام لکھیں",
            phoneNumberLabel: "فون نمبر",
            phoneNumberPlaceholder: "گاہک کا موبائل نمبر",
            shopAddressLabel: "دکان کا پتہ",
            shopAddressPlaceholder: "گلی، شہر کا نام...",
            orderItems: "آرڈر کے آئٹمز",
            emptyCart: "آرڈر لسٹ خالی ہے۔ نیچے سے آئٹم شامل کریں۔",
            addItemToOrder: "+ آرڈر میں آئٹم شامل کریں",
            sendWhatsApp: "واٹس ایپ پر آرڈر بھیجیں",
            sizeLabel: "سائز",
            selectItem: "آئٹم منتخب کریں",
            customItemOption: "+ نیا کسٹم آئٹم...",
            customItemNameLabel: "کسٹم آئٹم کا نام",
            customItemNamePlaceholder: "مثلاً لوکل بسکٹ",
            customSizeLabel: "سائز / پیکنگ (اختیاری)",
            customSizePlaceholder: "مثلاً 1 ڈبہ",
            quantity: "تعداد",
            addToOrder: "آرڈر میں شامل کریں",
            alertEnterShopName: "براہ کرم دکان کا نام درج کریں",
            alertMinOneItem: "براہ کرم آرڈر میں کم از کم ایک آرڈر آئٹم شامل کریں",
            alertEnterItemName: "براہ کرم آئٹم کا نام لکھیں",
            alertMinOneVariant: "براہ کرم کم از کم ایک سائز یا پیکنگ شامل کریں (مثلاً 1 لٹر، 5 کلو)",
            alertEnterCustomItemName: "براہ کرم کسٹم آئٹم کا نام درج کریں",
            homeTab: "ہوم",
            itemsTab: "آئٹمز",
            ordersTab: "آرڈرز",
            settingsTab: "سیٹنگز",
            installAlert: "ایپ ڈاؤن لوڈ کرنے کا طریقہ:\n\n1. براؤزر کے اوپر دائیں کونے میں موجود مینو (تین نقطوں) پر کلک کریں۔\n2. 'ایپ انسٹال کریں' یا 'ہوم اسکرین پر شامل کریں' کو منتخب کریں۔\n\nاس سے ایپ آپ کے فون پر ڈاؤن لوڈ ہو جائے گی!",
            whatsappNewBooking: "📦 *نیا آرڈر بکنگ*",
            whatsappSalesman: "👤 *سیلزمین:*",
            whatsappShopName: "🏪 *دکان کا نام:*",
            whatsappPhone: "📞 *فون نمبر:*",
            whatsappAddress: "📍 *پتہ:*",
            whatsappOrderDetails: "🛒 *آرڈر کی تفصیل:*",
            whatsappPrepareDispatch: "🚚 *براہ کرم سامان تیار کر کے ڈیلیور کریں*",
            whatsappQty: "تعداد",
            languageLabel: "زبان (Language)",
            pendingStatus: "پینڈنگ",
            deliveredStatus: "ڈیلیورڈ",
            itemVolumeLabel: "سائز / پیکنگ"
        },
        en: {
            dashboard: "Dashboard",
            installApp: "⬇ Install App",
            totalOrders: "Total Orders",
            totalItems: "Total Items",
            pending: "Pending",
            delivered: "Delivered",
            recentOrders: "Recent Orders",
            noOrdersYet: "No orders yet. Start booking!",
            itemsCount: (count) => `${count} items`,
            itemsInventory: "Items Inventory",
            addNewItem: "+ Add New Item",
            noItemsAvailable: "No items available. Please add new items.",
            deleteConfirm: "Delete this item?",
            variantsLabel: "Variants / Sizes",
            orderHistory: "Order History",
            noOrdersHistory: "No orders yet.",
            qtyLabel: "qty",
            settings: "Settings",
            salesmanName: "Salesman Name",
            ownerPhone: "Owner WhatsApp Number",
            phoneHint: "Include country code e.g. +923364459040",
            resetBtn: "Reset All App Data",
            resetConfirm: "Are you sure you want to delete all data?",
            createOrder: "Create Order",
            shopNameLabel: "Shop Name *",
            shopNamePlaceholder: "Enter Shop Name",
            phoneNumberLabel: "Phone Number",
            phoneNumberPlaceholder: "Customer Number",
            shopAddressLabel: "Shop Address",
            shopAddressPlaceholder: "Street, City...",
            orderItems: "Order Items",
            emptyCart: "Cart is empty. Add items below.",
            addItemToOrder: "+ Add Item to Order",
            sendWhatsApp: "Send Order via WhatsApp",
            sizeLabel: "Size",
            selectItem: "Select Item",
            customItemOption: "+ Add Custom Item...",
            customItemNameLabel: "Custom Item Name",
            customItemNamePlaceholder: "e.g. Local Biscuits",
            customSizeLabel: "Size / Variant (Optional)",
            customSizePlaceholder: "e.g. 1 Box",
            quantity: "Quantity",
            addToOrder: "Add to Order",
            alertEnterShopName: "Please enter Shop Name",
            alertMinOneItem: "Please add at least one item to the order",
            alertEnterItemName: "Enter item name",
            alertMinOneVariant: "Add at least one size/variant (e.g. 1kg, 1L)",
            alertEnterCustomItemName: "Please enter custom item name",
            homeTab: "Home",
            itemsTab: "Items",
            ordersTab: "Orders",
            settingsTab: "Settings",
            installAlert: "App Install Instruction:\n\n1. Tap the browser menu (3 dots at top right).\n2. Select 'Install App' or 'Add to Home screen'.\n\nThis will download the app to your phone!",
            whatsappNewBooking: "📦 *New Booking*",
            whatsappSalesman: "👤 *Salesman:*",
            whatsappShopName: "🏪 *Shop Name:*",
            whatsappPhone: "📞 *Phone:*",
            whatsappAddress: "📍 *Address:*",
            whatsappOrderDetails: "🛒 *Order Details:*",
            whatsappPrepareDispatch: "🚚 *Please Prepare Dispatch*",
            whatsappQty: "x",
            languageLabel: "Language",
            pendingStatus: "Pending",
            deliveredStatus: "Delivered",
            itemVolumeLabel: "Variants / Sizes"
        }
    };

    window.t = (key, param) => {
        const lang = state.data.settings.language || 'ur';
        const translation = i18n[lang][key];
        if (typeof translation === 'function') {
            return translation(param);
        }
        return translation || key;
    };
    const t = window.t;

    window.setLanguage = (lang) => {
        state.data.settings.language = lang;
        saveData();
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
        updateInstallBannerLang();
        render();
    };

    window.toggleLanguage = () => {
        const current = state.data.settings.language || 'ur';
        const next = current === 'ur' ? 'en' : 'ur';
        window.setLanguage(next);
    };

    const updateInstallBannerLang = () => {
        const bannerTitle = document.querySelector('#install-banner div div div:first-child');
        const bannerSub = document.querySelector('#install-banner div div div:last-child');
        const bannerBtn = document.getElementById('install-btn');
        if (bannerTitle && bannerSub && bannerBtn) {
            const lang = state.data.settings.language || 'ur';
            if (lang === 'ur') {
                bannerTitle.textContent = "داؤد ٹریڈر ایپ";
                bannerSub.textContent = "اپنے فون پر انسٹال کریں";
                bannerBtn.textContent = "انسٹال کریں";
            } else {
                bannerTitle.textContent = "Dawood Trader App";
                bannerSub.textContent = "Install on your device";
                bannerBtn.textContent = "Install";
            }
        }
    };

    // Set initial document language/direction on load
    document.documentElement.lang = state.data.settings.language || 'ur';
    document.documentElement.dir = (state.data.settings.language || 'ur') === 'ur' ? 'rtl' : 'ltr';

    // One-time seed for Urdu products
    if (!localStorage.getItem('dawood_seeded_v2')) {
        const defaultProducts = [
            { id: Date.now()+1, name: 'او جی کولا', category: 'Beverages', variants: ['345ML', '500ML', '1L', '1.5L', '2.25L'] },
            { id: Date.now()+2, name: 'بابا جوس', category: 'Beverages', variants: ['معیاری'] },
            { id: Date.now()+3, name: 'بابا جوس چھوٹا', category: 'Beverages', variants: ['معیاری'] },
            { id: Date.now()+4, name: 'انار جوس', category: 'Beverages', variants: ['1L'] },
            { id: Date.now()+5, name: 'مینگو جوس', category: 'Beverages', variants: ['1L'] },
            { id: Date.now()+6, name: 'اچار', category: 'Grocery', variants: ['معیاری'] }
        ];
        
        const existingNames = state.data.products.map(p => p.name.toLowerCase());
        let changed = false;
        defaultProducts.forEach(p => {
            if (!existingNames.includes(p.name.toLowerCase())) {
                state.data.products.push(p);
                changed = true;
            }
        });
        
        if (changed) {
            localStorage.setItem('dawood_data', JSON.stringify(state.data));
        }
        localStorage.setItem('dawood_seeded_v2', 'true');
    }

    window.saveData = () => {
        localStorage.setItem('dawood_data', JSON.stringify(state.data));
    };
    const saveData = window.saveData;

    window.navigate = (screen) => {
        state.currentScreen = screen;
        render();
    };

    const getBottomNav = (activeTab) => `
        <div class="bottom-nav">
            <div class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">
                <div class="nav-icon icon-home"></div>${t('homeTab')}
            </div>
            <div class="nav-item ${activeTab === 'products' ? 'active' : ''}" onclick="navigate('products')">
                <div class="nav-icon icon-products"></div>${t('itemsTab')}
            </div>
            <div class="nav-item fab" onclick="navigate('new_order')">
                <div class="nav-icon icon-add"></div>
            </div>
            <div class="nav-item ${activeTab === 'orders' ? 'active' : ''}" onclick="navigate('orders')">
                <div class="nav-icon icon-order"></div>${t('ordersTab')}
            </div>
            <div class="nav-item ${activeTab === 'settings' ? 'active' : ''}" onclick="navigate('settings')">
                <div class="nav-icon icon-settings"></div>${t('settingsTab')}
            </div>
        </div>
    `;

    const getHeader = (title, showExtra = false) => {
        const lang = state.data.settings.language || 'ur';
        if (showExtra) {
            return `
            <div class="header" style="flex-wrap: wrap; gap: 10px; display:flex; justify-content:space-between; align-items:center; width:100%;">
                <div class="header-title">${title}</div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="toggleLanguage()" style="background:#2c2c2e; color:white; border:1px solid var(--border-color); padding:8px 14px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        ${lang === 'ur' ? 'English' : 'اردو'}
                    </button>
                    <button onclick="triggerInstall()" style="background:var(--primary-gradient); color:white; border:none; padding:8px 14px; border-radius:10px; font-weight:bold; font-size:13px; box-shadow:0 2px 10px rgba(255,107,43,0.3); cursor:pointer;">${t('installApp')}</button>
                    <div style="background:var(--card-bg); padding:8px 14px; border-radius:12px; font-size:13px; font-weight:700; color:var(--primary-color); border:1px solid var(--border-color);">
                        ${state.data.settings.salesmanName}
                    </div>
                </div>
            </div>
            `;
        }
        return `
        <div class="header" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <div class="header-title">${title}</div>
            <button onclick="toggleLanguage()" style="background:#2c2c2e; color:white; border:1px solid var(--border-color); padding:8px 14px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                ${lang === 'ur' ? 'English' : 'اردو'}
            </button>
        </div>
        `;
    };

    window.deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
    });

    window.triggerInstall = async () => {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            window.deferredPrompt = null;
        } else {
            alert(t('installAlert'));
        }
    };

    const screens = {
        dashboard: () => {
            const { orders, products } = state.data;
            const pendingOrders = orders.filter(o => o.status === 'Pending').length;
            const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

            return `
            <div class="fade-in">
                ${getHeader(t('dashboard'), true)}
                
                <div class="cards-grid">
                    <div class="stat-card">
                        <div class="stat-title">${t('totalOrders')}</div>
                        <div class="stat-value" style="color:var(--primary-color)">${orders.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">${t('totalItems')}</div>
                        <div class="stat-value">${products.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">${t('pending')}</div>
                        <div class="stat-value" style="color:var(--warning)">${pendingOrders}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">${t('delivered')}</div>
                        <div class="stat-value" style="color:var(--success)">${deliveredOrders}</div>
                    </div>
                </div>

                <div class="list-section">
                    <div style="font-size:20px; font-weight:800; margin-bottom:16px;">${t('recentOrders')}</div>
                    ${orders.length === 0 ? `<div class="empty-state">${t('noOrdersYet')}</div>` : ''}
                    ${orders.slice().reverse().slice(0, 5).map(order => `
                        <div class="list-item">
                            <div style="display:flex; align-items:center; gap:16px;">
                                <div class="item-icon">${order.shop.charAt(0)}</div>
                                <div>
                                    <div style="font-weight:700; font-size:16px;">${order.shop}</div>
                                    <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">${t('itemsCount', order.items.length)} • ${order.date}</div>
                                </div>
                            </div>
                            <div style="color:var(--primary-color); font-weight:700; font-size:14px;">${order.status === 'Pending' ? t('pendingStatus') : t('deliveredStatus')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${getBottomNav('dashboard')}
            `;
        },

        products: () => {
            const { products } = state.data;
            window.openAddProduct = () => {
                state.tempProduct = { id: Date.now(), name: '', category: '', variants: [] };
                renderModal('addProduct');
            };
            window.deleteProduct = (id) => {
                if(confirm(t('deleteConfirm'))) {
                    state.data.products = state.data.products.filter(p => p.id !== id);
                    saveData();
                    render();
                }
            };
            return `
            <div class="fade-in">
                ${getHeader(t('itemsInventory'))}
                <div class="list-section" style="padding-top:0">
                    <button class="btn btn-primary" style="margin-bottom:24px;" onclick="openAddProduct()">
                        <div class="icon-add" style="width:20px; height:20px; background:white; -webkit-mask-size:cover; mask-size:cover;"></div>
                        ${t('addNewItem')}
                    </button>
                    
                    ${products.length === 0 ? `<div class="empty-state">${t('noItemsAvailable')}</div>` : ''}
                    
                    ${products.map(p => `
                        <div class="list-item product-item">
                            <div class="product-header">
                                <div style="display:flex; align-items:center; gap:16px;">
                                    <div class="item-icon">${p.name.charAt(0)}</div>
                                    <div>
                                        <div style="font-weight:700; font-size:18px;">${p.name}</div>
                                        <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">${t('variantsLabel')}: ${p.variants.join(', ')}</div>
                                    </div>
                                </div>
                                <div style="color:var(--danger); font-size:28px; padding:0 10px; cursor:pointer;" onclick="deleteProduct(${p.id})">×</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${getBottomNav('products')}
            `;
        },

        orders: () => {
            const { orders } = state.data;
            return `
            <div class="fade-in">
                ${getHeader(t('orderHistory'))}
                <div class="list-section" style="padding-top:0">
                    ${orders.length === 0 ? `<div class="empty-state">${t('noOrdersHistory')}</div>` : ''}
                    ${orders.slice().reverse().map(order => `
                        <div class="list-item" style="flex-direction:column; align-items:stretch;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                                <div style="display:flex; gap:16px;">
                                    <div class="item-icon">${order.shop.charAt(0)}</div>
                                    <div>
                                        <div style="font-weight:700; font-size:18px;">${order.shop}</div>
                                        <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">${order.date}</div>
                                    </div>
                                </div>
                                <div style="font-weight:700; color:var(--primary-color); font-size:14px;">${order.status === 'Pending' ? t('pendingStatus') : t('deliveredStatus')}</div>
                            </div>
                            <div style="background:#2c2c2e; padding:16px; border-radius:12px; font-size:14px; line-height:1.8;">
                                ${order.items.map(i => `<div style="font-weight:500;">• ${i.productName} ${i.variant ? '('+i.variant+')' : ''} ${t('qtyLabel')}: ${i.qty}</div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${getBottomNav('orders')}
            `;
        },

        settings: () => `
            <div class="fade-in">
                ${getHeader(t('settings'))}
                <div class="list-section">
                    <div class="input-group">
                        <label class="input-label">${t('salesmanName')}</label>
                        <input type="text" class="input-field" value="${state.data.settings.salesmanName}" onchange="state.data.settings.salesmanName=this.value; saveData();" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">${t('ownerPhone')}</label>
                        <input type="tel" class="input-field" value="${state.data.settings.ownerPhone}" onchange="state.data.settings.ownerPhone=this.value; saveData();" />
                        <div style="font-size:12px; color:var(--text-secondary); margin-top:8px;">${t('phoneHint')}</div>
                    </div>
                    
                    <button class="btn btn-danger" style="margin-top:40px;" onclick="
                        if(confirm(t('resetConfirm'))) {
                            localStorage.removeItem('dawood_data');
                            window.location.reload();
                        }
                    ">${t('resetBtn')}</button>
                </div>
            </div>
            ${getBottomNav('settings')}
        `,

        new_order: () => {
            window.updateCartQty = (idx, delta) => {
                if(state.cart[idx].qty + delta > 0) {
                    state.cart[idx].qty += delta;
                    render();
                }
            };
            window.removeFromCart = (idx) => {
                state.cart.splice(idx, 1);
                render();
            };
            
            window.openProductSelector = () => {
                state.tempOrderSelection = { productIndex: 0, variant: '', qty: 1, isCustom: state.data.products.length === 0 };
                if (state.data.products.length > 0) {
                    state.tempOrderSelection.variant = state.data.products[0].variants[0];
                }
                renderModal('selectProduct');
            };

            window.sendWhatsApp = () => {
                const shopName = document.getElementById('shop-name').value.trim();
                const shopPhone = document.getElementById('shop-phone').value.trim();
                const address = document.getElementById('shop-address').value.trim();
                
                if(!shopName) return alert(t('alertEnterShopName'));
                if(state.cart.length === 0) return alert(t('alertMinOneItem'));
                
                let text = t('whatsappNewBooking') + "\n\n";
                text += t('whatsappSalesman') + " " + state.data.settings.salesmanName + "\n\n";
                text += t('whatsappShopName') + "\n" + shopName + "\n\n";
                if(shopPhone) text += t('whatsappPhone') + "\n" + shopPhone + "\n\n";
                if(address) text += t('whatsappAddress') + "\n" + address + "\n\n";
                
                text += t('whatsappOrderDetails') + "\n";
                state.cart.forEach((item) => {
                    text += "• " + item.productName + " " + (item.variant ? '('+item.variant+')' : '') + " " + t('whatsappQty') + ": " + item.qty + "\n";
                });
                text += "\n" + t('whatsappPrepareDispatch');

                const newOrder = {
                    id: Date.now().toString().slice(-4),
                    shop: shopName,
                    phone: shopPhone,
                    address: address,
                    items: [...state.cart],
                    status: 'Pending',
                    date: new Date().toLocaleDateString()
                };
                state.data.orders.push(newOrder);
                saveData();

                state.cart = [];
                
                let phone = state.data.settings.ownerPhone;
                phone = phone.replace(/[^0-9+]/g, '');
                
                const encodedText = encodeURIComponent(text);
                const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
                const a = document.createElement('a');
                a.href = waUrl;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    navigate('dashboard');
                }, 100);
            };

            return `
            <div class="fade-in">
                ${getHeader(t('createOrder'))}
                <div class="list-section" style="padding-top:0">
                    <div class="input-group">
                        <label class="input-label">${t('shopNameLabel')}</label>
                        <input type="text" id="shop-name" class="input-field" placeholder="${t('shopNamePlaceholder')}" value="${state.orderForm.shopName}" oninput="state.orderForm.shopName = this.value" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">${t('phoneNumberLabel')}</label>
                        <input type="tel" id="shop-phone" class="input-field" placeholder="${t('phoneNumberPlaceholder')}" value="${state.orderForm.shopPhone}" oninput="state.orderForm.shopPhone = this.value" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">${t('shopAddressLabel')}</label>
                        <input type="text" id="shop-address" class="input-field" placeholder="${t('shopAddressPlaceholder')}" value="${state.orderForm.address}" oninput="state.orderForm.address = this.value" />
                    </div>

                    <div style="margin: 32px 0 16px; font-size:18px; font-weight:800; color:var(--text-primary)">${t('orderItems')}</div>

                    ${state.cart.length === 0 ? `<div class="empty-state" style="padding:30px; border:2px dashed #3a3a3c; border-radius:16px; margin-bottom:20px;">${t('emptyCart')}</div>` : ''}

                    ${state.cart.map((item, idx) => `
                        <div class="order-item-card fade-in">
                            <div class="remove-item" onclick="removeFromCart(${idx})">×</div>
                            <div style="font-weight:700; font-size:18px; margin-bottom:4px; ${state.data.settings.language === 'ur' ? 'padding-left:30px;' : 'padding-right:30px;'}">${item.productName}</div>
                            ${item.variant ? `<div style="font-size:14px; color:var(--text-secondary); margin-bottom:16px; font-weight:500;">${t('sizeLabel')}: ${item.variant}</div>` : `<div style="height:16px;"></div>`}
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
                                <div class="qty-val">${item.qty}</div>
                                <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
                            </div>
                        </div>
                    `).join('')}

                    <button class="btn btn-secondary" onclick="openProductSelector()" style="margin-bottom: 30px;">
                        ${t('addItemToOrder')}
                    </button>

                    <button class="btn btn-primary" onclick="sendWhatsApp()">
                        <div class="icon-whatsapp"></div>
                        ${t('sendWhatsApp')}
                    </button>
                </div>
            </div>
            ${getBottomNav('new_order')}
            `;
        }
    };

    // Modals
    const modals = {
        addProduct: () => {
            window.addVariant = () => {
                const v = document.getElementById('variant-input').value.trim();
                if(v && !state.tempProduct.variants.includes(v)) {
                    state.tempProduct.variants.push(v);
                    renderModal('addProduct');
                }
            };
            window.removeVariant = (idx) => {
                state.tempProduct.variants.splice(idx, 1);
                renderModal('addProduct');
            };
            window.saveProduct = () => {
                const name = document.getElementById('product-name').value.trim();
                if(!name) return alert(t('alertEnterItemName'));
                if(state.tempProduct.variants.length === 0) return alert(t('alertMinOneVariant'));
                
                state.tempProduct.name = name;
                state.data.products.push(state.tempProduct);
                saveData();
                closeModal();
                render();
            };

            return `
            <div class="modal-overlay">
                <div class="modal-content fade-in">
                    <div class="modal-header">
                        <div class="modal-title">${t('addNewItem')}</div>
                        <div class="modal-close" onclick="closeModal()">×</div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">${state.data.settings.language === 'ur' ? 'آئٹم کا نام (مثلاً پیپسی، چینی)' : 'Item Name (e.g. Pepsi, Sugar)'}</label>
                        <input type="text" id="product-name" class="input-field" placeholder="${state.data.settings.language === 'ur' ? 'نام لکھیں' : 'Name'}" value="${state.tempProduct.name}">
                    </div>
                    <div class="input-group">
                        <label class="input-label">${t('itemVolumeLabel')}</label>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="variant-input" class="input-field" placeholder="${state.data.settings.language === 'ur' ? 'مثلاً 1.5 لٹر، 5 کلو' : 'e.g. 1.5 L, 5 kg'}">
                            <button class="btn btn-secondary btn-small" onclick="addVariant()">${state.data.settings.language === 'ur' ? 'شامل کریں' : 'Add'}</button>
                        </div>
                    </div>
                    <div style="margin-bottom:24px;">
                        ${state.tempProduct.variants.map((v, i) => `
                            <div class="variant-tag">
                                ${v} <span class="variant-tag-close" onclick="removeVariant(${i})">×</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary" onclick="saveProduct()">${state.data.settings.language === 'ur' ? 'آئٹم محفوظ کریں' : 'Save Item'}</button>
                </div>
            </div>
            `;
        },

        selectProduct: () => {
            const { products } = state.data;
            const selection = state.tempOrderSelection;
            const pIndex = selection.productIndex;
            const p = products[pIndex];
            
            window.changeProduct = (idx) => {
                if (idx === -1) {
                    state.tempOrderSelection.isCustom = true;
                } else {
                    state.tempOrderSelection.isCustom = false;
                    state.tempOrderSelection.productIndex = idx;
                    state.tempOrderSelection.variant = products[idx].variants[0];
                }
                renderModal('selectProduct');
            };
            window.changeVariant = (v) => {
                state.tempOrderSelection.variant = v;
                renderModal('selectProduct');
            };
            window.confirmAddCart = () => {
                if (selection.isCustom) {
                    const customName = document.getElementById('custom-name').value.trim();
                    const customVariant = document.getElementById('custom-variant').value.trim();
                    
                    if (!customName) return alert(t('alertEnterCustomItemName'));
                    
                    state.cart.push({
                        productName: customName,
                        variant: customVariant,
                        qty: selection.qty
                    });
                } else {
                    state.cart.push({
                        productName: products[selection.productIndex].name,
                        variant: selection.variant,
                        qty: selection.qty
                    });
                }
                closeModal();
                render();
            };

            return `
            <div class="modal-overlay">
                <div class="modal-content fade-in">
                    <div class="modal-header">
                        <div class="modal-title">${t('selectItem')}</div>
                        <div class="modal-close" onclick="closeModal()">×</div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">${state.data.settings.language === 'ur' ? 'آئٹم' : 'Item'}</label>
                        <select class="input-field" onchange="changeProduct(parseInt(this.value))">
                            ${products.map((prod, idx) => `<option value="${idx}" ${!selection.isCustom && idx === pIndex ? 'selected' : ''}>${prod.name}</option>`).join('')}
                            <option value="-1" ${selection.isCustom ? 'selected' : ''} style="font-weight:bold;">${t('customItemOption')}</option>
                        </select>
                    </div>

                    ${selection.isCustom ? `
                        <div class="input-group fade-in">
                            <label class="input-label">${t('customItemNameLabel')}</label>
                            <input type="text" id="custom-name" class="input-field" placeholder="${t('customItemNamePlaceholder')}">
                        </div>
                        <div class="input-group fade-in">
                            <label class="input-label">${t('customSizeLabel')}</label>
                            <input type="text" id="custom-variant" class="input-field" placeholder="${t('customSizePlaceholder')}">
                        </div>
                    ` : `
                        <div class="input-group fade-in">
                            <label class="input-label">سائز / پیکنگ</label>
                            <div class="variant-chips">
                                ${p ? p.variants.map(v => `
                                    <div class="chip ${selection.variant === v ? 'active' : ''}" onclick="changeVariant('${v}')">${v}</div>
                                `).join('') : ''}
                            </div>
                        </div>
                    `}

                    <div class="input-group" style="margin-top:24px;">
                        <label class="input-label">تعداد</label>
                        <div class="qty-control" style="width:100%; justify-content:center; padding:12px;">
                            <button class="qty-btn" onclick="if(state.tempOrderSelection.qty>1){state.tempOrderSelection.qty--; renderModal('selectProduct');}">-</button>
                            <div class="qty-val" style="width:50px;">${state.tempOrderSelection.qty}</div>
                            <button class="qty-btn" onclick="state.tempOrderSelection.qty++; renderModal('selectProduct');">+</button>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="margin-top:24px;" onclick="confirmAddCart()">آرڈر میں شامل کریں</button>
                </div>
            </div>
            `;
        }
    };

    window.renderModal = (modalName) => {
        state.modal = modalName;
        render();
    };

    window.closeModal = () => {
        state.modal = null;
        render();
    };

    const render = () => {
        updateInstallBannerLang();
        let html = '';
        const screenRenderer = screens[state.currentScreen];
        if (screenRenderer) html += screenRenderer();
        if (state.modal && modals[state.modal]) html += modals[state.modal]();
        app.innerHTML = html;
    };

    render();
});
