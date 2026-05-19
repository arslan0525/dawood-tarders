document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // State
    const state = {
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        user: { name: 'Admin', phone: '' },
        currentScreen: 'splash',
        cart: [],
        products: [
            { id: 1, name: 'Premium Rice', variants: ['5kg', '10kg', '25kg'], price: 1200 },
            { id: 2, name: 'Cooking Oil', variants: ['1L', '3L', '5L'], price: 450 },
            { id: 3, name: 'Sugar Fine', variants: ['1kg', '5kg'], price: 140 },
            { id: 4, name: 'Wheat Flour', variants: ['10kg', '20kg'], price: 1300 },
            { id: 5, name: 'Tea Pack', variants: ['200g', '500g', '1kg'], price: 400 },
            { id: 6, name: 'Daal Chana', variants: ['1kg', '5kg'], price: 280 }
        ],
        orders: [
            { id: '1024', shop: 'Shop A Market', items: 3, total: 4500, status: 'Pending', date: 'Today' },
            { id: '1023', shop: 'Khan Traders', items: 12, total: 18200, status: 'Delivered', date: 'Yesterday' },
            { id: '1022', shop: 'Mian Store', items: 5, total: 6300, status: 'Dispatch', date: 'Yesterday' }
        ],
        orderForm: {
            shopName: '',
            shopPhone: ''
        }
    };

    // Navigation Helper
    window.navigate = (screen) => {
        state.currentScreen = screen;
        render();
    };

    const getBottomNav = (activeTab) => `
        <div class="bottom-nav">
            <div class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">
                <div class="nav-icon icon-home"></div>
                Home
            </div>
            <div class="nav-item ${activeTab === 'products' ? 'active' : ''}" onclick="navigate('products')">
                <div class="nav-icon icon-products"></div>
                Products
            </div>
            <div class="nav-item fab" onclick="navigate('new_order')">
                <div class="nav-icon icon-add"></div>
            </div>
            <div class="nav-item ${activeTab === 'orders' ? 'active' : ''}" onclick="navigate('orders')">
                <div class="nav-icon icon-order"></div>
                Orders
            </div>
            <div class="nav-item ${activeTab === 'profile' ? 'active' : ''}" onclick="navigate('profile')">
                <div class="nav-icon icon-profile"></div>
                Profile
            </div>
        </div>
    `;

    // Screen Renderers
    const screens = {
        splash: () => {
            setTimeout(() => {
                navigate(state.isLoggedIn ? 'dashboard' : 'login');
            }, 2000);
            return `
                <div class="splash-screen fade-in">
                    <div class="splash-logo">D</div>
                    <div class="splash-title">Dawood Trader</div>
                    <div class="splash-subtitle">Wholesale Order Management</div>
                </div>
            `;
        },

        login: () => `
            <div class="login-screen fade-in">
                <div class="login-header">
                    <div class="login-logo">D</div>
                    <h1 class="splash-title">Welcome Back</h1>
                    <p class="splash-subtitle">Login to your account</p>
                </div>
                <div class="input-group">
                    <label class="input-label">Phone Number</label>
                    <input type="tel" id="login-phone" class="input-field" placeholder="0300 1234567" />
                </div>
                <div class="input-group">
                    <label class="input-label">Password</label>
                    <input type="password" id="login-pass" class="input-field" placeholder="••••••••" />
                </div>
                <button class="btn btn-primary" style="margin-top:20px" onclick="
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.reload();
                ">Login Securely</button>
            </div>
        `,

        dashboard: () => `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Dashboard</div>
                    <div style="background:var(--card-bg); padding:8px 16px; border-radius:20px; font-size:14px; font-weight:600; color:var(--primary-color);">
                        ${state.user.name}
                    </div>
                </div>
                
                <div class="cards-grid">
                    <div class="stat-card">
                        <div class="stat-title">Total Orders</div>
                        <div class="stat-value" style="color:var(--primary-color)">${state.orders.length + 120}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Pending</div>
                        <div class="stat-value">12</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Dispatched</div>
                        <div class="stat-value">8</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Delivered</div>
                        <div class="stat-value">100</div>
                    </div>
                </div>

                <div class="list-section">
                    <div class="list-header">
                        <div class="list-title">Recent Orders</div>
                        <div style="font-size:14px; color:var(--primary-color); font-weight:600; cursor:pointer;" onclick="navigate('orders')">See All</div>
                    </div>
                    
                    ${state.orders.slice(0, 2).map(order => `
                        <div class="list-item">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="item-icon">${order.shop.charAt(0)}</div>
                                <div>
                                    <div style="font-weight:600; font-size:16px;">${order.shop}</div>
                                    <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">${order.items} items • ${order.date}</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:700; font-size:16px;">Rs. ${order.total.toLocaleString()}</div>
                                <div class="status-badge status-${order.status.toLowerCase()}" style="margin-top:4px;">${order.status}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('dashboard')}
            </div>
        `,

        orders: () => `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Order History</div>
                </div>
                <div class="list-section" style="padding-top:0">
                    <div class="input-group">
                        <input type="text" class="input-field" placeholder="Search orders, shop name..." />
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom:20px; overflow-x:auto; padding-bottom:5px;">
                        <div class="chip active">All</div>
                        <div class="chip">Pending</div>
                        <div class="chip">Dispatch</div>
                        <div class="chip">Delivered</div>
                    </div>
                    
                    ${state.orders.map(order => `
                        <div class="list-item">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="item-icon">${order.shop.charAt(0)}</div>
                                <div>
                                    <div style="font-weight:600; font-size:16px;">${order.shop}</div>
                                    <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">ID: #${order.id} • ${order.date}</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:700; font-size:16px;">Rs. ${order.total.toLocaleString()}</div>
                                <div class="status-badge status-${order.status.toLowerCase()}" style="margin-top:4px;">${order.status}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('orders')}
            </div>
        `,

        products: () => `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Products</div>
                </div>
                <div class="list-section" style="padding-top:0">
                    <div class="input-group">
                        <input type="text" class="input-field" placeholder="Search products..." />
                    </div>
                    ${state.products.map(product => `
                        <div class="list-item product-item">
                            <div class="product-header">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div class="item-icon">${product.name.charAt(0)}</div>
                                    <div>
                                        <div style="font-weight:600; font-size:16px;">${product.name}</div>
                                        <div style="color:var(--primary-color); font-weight:700; font-size:14px; margin-top:2px;">Rs. ${product.price} / unit</div>
                                    </div>
                                </div>
                            </div>
                            <div class="variant-chips" style="margin-left: 60px; margin-bottom:0;">
                                ${product.variants.map((v, i) => `<div class="chip ${i===0?'active':''}">${v}</div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('products')}
            </div>
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
            window.addToCart = () => {
                state.cart.push({
                    productId: 1,
                    productName: state.products[0].name,
                    variant: state.products[0].variants[0],
                    qty: 1,
                    price: state.products[0].price
                });
                render();
            };
            window.sendWhatsApp = () => {
                if(!state.orderForm.shopName) return alert("Please enter Shop Name");
                if(state.cart.length === 0) return alert("Please add products");
                
                let text = `*New Order - Dawood Trader*%0A%0AShop: ${state.orderForm.shopName}%0APhone: ${state.orderForm.shopPhone}%0A%0A*Items:*%0A`;
                let total = 0;
                state.cart.forEach((item, i) => {
                    let cost = item.qty * item.price;
                    total += cost;
                    text += `${i+1}. ${item.productName} (${item.variant}) x ${item.qty} = Rs. ${cost}%0A`;
                });
                text += `%0A*Total: Rs. ${total}*`;
                window.open(`https://wa.me/?text=${text}`, '_blank');
                state.cart = [];
                state.orderForm = { shopName: '', shopPhone: '' };
                navigate('dashboard');
            };

            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title" style="display:flex; align-items:center; gap:10px;">
                        <span onclick="navigate('dashboard')" style="cursor:pointer; font-size:20px;">←</span> 
                        Create Order
                    </div>
                </div>
                <div class="form-section">
                    <div class="input-group">
                        <label class="input-label">Shop Name</label>
                        <input type="text" class="input-field" placeholder="Enter Shop Name" value="${state.orderForm.shopName}" onchange="state.orderForm.shopName = this.value" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Phone Number (Optional)</label>
                        <input type="tel" class="input-field" placeholder="03xx xxxxxxx" value="${state.orderForm.shopPhone}" onchange="state.orderForm.shopPhone = this.value" />
                    </div>

                    <div style="margin: 30px 0 16px; font-size:18px; font-weight:700;">Order Items</div>

                    ${state.cart.map((item, idx) => `
                        <div class="order-item-card fade-in">
                            <div class="remove-item" onclick="removeFromCart(${idx})">×</div>
                            <div style="font-weight:600; font-size:16px; margin-bottom:4px;">${item.productName}</div>
                            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Variant: ${item.variant} • Rs. ${item.price}</div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="qty-control">
                                    <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
                                    <div class="qty-val">${item.qty}</div>
                                    <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
                                </div>
                                <div style="font-weight:700; color:var(--primary-color);">Rs. ${item.qty * item.price}</div>
                            </div>
                        </div>
                    `).join('')}

                    <button class="btn btn-secondary" onclick="addToCart()" style="margin-bottom: 30px;">
                        + Add Product
                    </button>

                    <button class="btn btn-primary" onclick="sendWhatsApp()">
                        <div class="whatsapp-icon"></div>
                        Send Order on WhatsApp
                    </button>
                </div>
            </div>
        `},

        profile: () => `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Profile</div>
                </div>
                <div class="form-section" style="padding-top:20px; text-align:center;">
                    <div class="splash-logo" style="margin: 0 auto 20px;">${state.user.name.charAt(0)}</div>
                    <h2 style="margin-bottom:5px;">${state.user.name}</h2>
                    <p style="color:var(--text-secondary); margin-bottom: 30px;">Salesman Account</p>
                    
                    <button class="btn btn-secondary" style="margin-bottom:16px; color:var(--danger); border-color:var(--danger);" onclick="
                        localStorage.clear();
                        window.location.reload();
                    ">Logout</button>
                </div>
                ${getBottomNav('profile')}
            </div>
        `
    };

    // Main render function
    const render = () => {
        const screenRenderer = screens[state.currentScreen];
        if (screenRenderer) {
            app.innerHTML = screenRenderer();
        }
    };

    // Detect if PWA install prompt is needed (Mocking install banner for now)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (!isStandalone && state.currentScreen !== 'splash' && state.currentScreen !== 'login') {
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div>
                <div style="font-weight:700;">Dawood Trader App</div>
                <div style="font-size:11px; opacity:0.9;">Install for faster access</div>
            </div>
            <button class="btn-install" onclick="this.parentElement.style.display='none'">Install Now</button>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
    }

    render();
});
