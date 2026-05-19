document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // Default Settings & Data
    const defaultData = {
        products: [],
        orders: [],
        settings: {
            ownerPhone: "923364459040",
            salesmanName: "Dawood Sales"
        }
    };

    // Initialize LocalStorage if empty
    if (!localStorage.getItem('dawood_data')) {
        localStorage.setItem('dawood_data', JSON.stringify(defaultData));
    }

    const state = {
        data: JSON.parse(localStorage.getItem('dawood_data')),
        currentScreen: 'dashboard',
        cart: [],
        orderForm: { shopName: '', shopPhone: '', address: '' },
        modal: null,
        tempProduct: { name: '', category: '', variants: [] },
        tempOrderSelection: { productIndex: -1, variant: '', qty: 1 }
    };

    const saveData = () => {
        localStorage.setItem('dawood_data', JSON.stringify(state.data));
    };

    window.navigate = (screen) => {
        state.currentScreen = screen;
        render();
    };

    const getBottomNav = (activeTab) => `
        <div class="bottom-nav">
            <div class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">
                <div class="nav-icon icon-home"></div>Home
            </div>
            <div class="nav-item ${activeTab === 'orders' ? 'active' : ''}" onclick="navigate('orders')">
                <div class="nav-icon icon-order"></div>Orders
            </div>
            <div class="nav-item fab" onclick="navigate('new_order')">
                <div class="nav-icon icon-add"></div>
            </div>
            <div class="nav-item ${activeTab === 'products' ? 'active' : ''}" onclick="navigate('products')">
                <div class="nav-icon icon-products"></div>Products
            </div>
            <div class="nav-item ${activeTab === 'settings' ? 'active' : ''}" onclick="navigate('settings')">
                <div class="nav-icon icon-settings"></div>Settings
            </div>
        </div>
    `;

    const screens = {
        dashboard: () => {
            const { orders, products } = state.data;
            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === 'Pending').length;
            const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
            const totalProducts = products.length;

            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Dashboard</div>
                    <div style="background:var(--card-bg); padding:6px 12px; border-radius:12px; font-size:13px; font-weight:600; color:var(--primary-color);">
                        ${state.data.settings.salesmanName}
                    </div>
                </div>
                
                <div class="cards-grid">
                    <div class="stat-card">
                        <div class="stat-title">Total Orders</div>
                        <div class="stat-value" style="color:var(--primary-color)">${totalOrders}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Total Products</div>
                        <div class="stat-value">${totalProducts}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Pending</div>
                        <div class="stat-value" style="color:var(--warning)">${pendingOrders}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Delivered</div>
                        <div class="stat-value" style="color:var(--success)">${deliveredOrders}</div>
                    </div>
                </div>

                <div class="list-section">
                    <div class="list-title" style="margin-bottom:16px;">Recent Orders</div>
                    ${totalOrders === 0 ? `<div class="empty-state">No orders yet. Start booking!</div>` : ''}
                    ${orders.slice().reverse().slice(0, 5).map(order => `
                        <div class="list-item">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="item-icon">${order.shop.charAt(0)}</div>
                                <div>
                                    <div style="font-weight:600; font-size:16px;">${order.shop}</div>
                                    <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${order.items.length} items • ${order.date}</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="color:var(--primary-color); font-weight:600; font-size:13px; margin-top:4px;">${order.status}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('dashboard')}
            </div>
            `;
        },

        products: () => {
            const { products } = state.data;
            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Product Catalog</div>
                </div>
                <div class="list-section" style="padding-top:0">
                    ${products.length === 0 ? `<div class="empty-state">No products found. Add products in Settings > Manage Products.</div>` : ''}
                    ${products.map(p => `
                        <div class="list-item product-item">
                            <div class="product-header">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div class="item-icon">${p.name.charAt(0)}</div>
                                    <div>
                                        <div style="font-weight:600; font-size:16px;">${p.name}</div>
                                        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Category: ${p.category || 'General'}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="variant-chips" style="margin-left:56px; margin-bottom:0;">
                                ${p.variants.map(v => `<div class="chip">${v}</div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('products')}
            </div>
            `;
        },

        orders: () => {
            const { orders } = state.data;
            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Order History</div>
                </div>
                <div class="list-section" style="padding-top:0">
                    ${orders.length === 0 ? `<div class="empty-state">No orders yet.</div>` : ''}
                    ${orders.slice().reverse().map(order => `
                        <div class="list-item" style="flex-direction:column; align-items:stretch;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                                <div style="display:flex; gap:12px;">
                                    <div class="item-icon">${order.shop.charAt(0)}</div>
                                    <div>
                                        <div style="font-weight:600; font-size:16px;">${order.shop}</div>
                                        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${order.date}</div>
                                    </div>
                                </div>
                                <div style="font-weight:600; color:var(--primary-color); font-size:13px;">${order.status}</div>
                            </div>
                            <div style="background:var(--bg-color); padding:10px; border-radius:8px; font-size:13px;">
                                ${order.items.map(i => `<div>• ${i.productName} (${i.variant}) x${i.qty}</div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('orders')}
            </div>
            `;
        },

        settings: () => `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Settings</div>
                </div>
                <div class="list-section">
                    <div class="input-group">
                        <label class="input-label">Salesman Name</label>
                        <input type="text" class="input-field" value="${state.data.settings.salesmanName}" onchange="state.data.settings.salesmanName=this.value; saveData();" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Owner WhatsApp Number</label>
                        <input type="tel" class="input-field" value="${state.data.settings.ownerPhone}" onchange="state.data.settings.ownerPhone=this.value; saveData();" />
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Include country code e.g. 923364459040</div>
                    </div>
                    
                    <button class="btn btn-secondary" style="margin: 24px 0 16px; border-color:var(--primary-color); color:var(--primary-color)" onclick="navigate('manage_products')">
                        Manage Products & Variants
                    </button>

                    <button class="btn btn-danger" onclick="
                        if(confirm('Are you sure you want to delete all data?')) {
                            localStorage.removeItem('dawood_data');
                            window.location.reload();
                        }
                    ">Reset All App Data</button>
                </div>
                ${getBottomNav('settings')}
            </div>
        `,

        manage_products: () => {
            window.openAddProduct = () => {
                state.tempProduct = { id: Date.now(), name: '', category: '', variants: [] };
                renderModal('addProduct');
            };
            window.deleteProduct = (id) => {
                if(confirm('Delete this product?')) {
                    state.data.products = state.data.products.filter(p => p.id !== id);
                    saveData();
                    render();
                }
            };
            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">
                        <span class="back-btn" onclick="navigate('settings')">←</span>
                        Manage Products
                    </div>
                </div>
                <div class="list-section" style="padding-top:0">
                    <button class="btn btn-primary" style="margin-bottom:20px;" onclick="openAddProduct()">+ Add New Product</button>
                    
                    ${state.data.products.length === 0 ? `<div class="empty-state">No products added. Add products to show in order screen.</div>` : ''}
                    
                    ${state.data.products.map(p => `
                        <div class="list-item product-item">
                            <div class="product-header">
                                <div>
                                    <div style="font-weight:600; font-size:16px;">${p.name}</div>
                                    <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Variants: ${p.variants.join(', ')}</div>
                                </div>
                                <div style="color:var(--danger); font-size:20px; cursor:pointer; padding:5px;" onclick="deleteProduct(${p.id})">×</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        },

        new_order: () => {
            const { products } = state.data;

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
                if(products.length === 0) {
                    alert('Please add products from Settings first.');
                    return;
                }
                state.tempOrderSelection = { productIndex: 0, variant: products[0].variants[0], qty: 1 };
                renderModal('selectProduct');
            };

            window.sendWhatsApp = () => {
                const { shopName, shopPhone, address } = state.orderForm;
                if(!shopName) return alert("Please enter Shop Name");
                if(state.cart.length === 0) return alert("Please add at least one product");
                
                let text = `📦 *New Booking*%0A%0A`;
                text += `👤 *Salesman:* ${state.data.settings.salesmanName}%0A%0A`;
                text += `🏪 *Shop Name:*%0A${shopName}%0A%0A`;
                if(shopPhone) text += `📞 *Phone:*%0A${shopPhone}%0A%0A`;
                if(address) text += `📍 *Address:*%0A${address}%0A%0A`;
                
                text += `🛒 *Order Details:*%0A`;
                state.cart.forEach((item) => {
                    text += `• ${item.productName} ${item.variant} x${item.qty}%0A`;
                });
                text += `%0A🚚 *Please Prepare Dispatch*`;

                // Save Order
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

                // Clean Cart
                state.cart = [];
                state.orderForm = { shopName: '', shopPhone: '', address: '' };
                
                const phone = state.data.settings.ownerPhone.replace(/\+/g, '');
                window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                
                navigate('dashboard');
            };

            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Create Order</div>
                </div>
                <div class="list-section" style="padding-top:0">
                    <div class="input-group">
                        <label class="input-label">Shop Name *</label>
                        <input type="text" class="input-field" placeholder="Enter Shop Name" value="${state.orderForm.shopName}" onchange="state.orderForm.shopName = this.value" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Phone Number</label>
                        <input type="tel" class="input-field" placeholder="Customer Number" value="${state.orderForm.shopPhone}" onchange="state.orderForm.shopPhone = this.value" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Shop Address</label>
                        <input type="text" class="input-field" placeholder="Street, City..." value="${state.orderForm.address}" onchange="state.orderForm.address = this.value" />
                    </div>

                    <div style="margin: 24px 0 16px; font-size:16px; font-weight:700; color:var(--primary-color)">Selected Products</div>

                    ${state.cart.length === 0 ? `<div class="empty-state" style="padding:20px; border:1px dashed var(--border-color); border-radius:12px; margin-bottom:16px;">Cart is empty</div>` : ''}

                    ${state.cart.map((item, idx) => `
                        <div class="order-item-card fade-in">
                            <div class="remove-item" onclick="removeFromCart(${idx})">×</div>
                            <div style="font-weight:600; font-size:16px; margin-bottom:4px;">${item.productName}</div>
                            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Size/Variant: ${item.variant}</div>
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
                                <div class="qty-val">${item.qty}</div>
                                <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
                            </div>
                        </div>
                    `).join('')}

                    <button class="btn btn-secondary" onclick="openProductSelector()" style="margin-bottom: 30px;">
                        + Add Product to Order
                    </button>

                    <button class="btn btn-primary" onclick="sendWhatsApp()">
                        <div class="icon-whatsapp"></div>
                        Send Order via WhatsApp
                    </button>
                </div>
                ${getBottomNav('new_order')}
            </div>
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
                if(!state.tempProduct.name) return alert("Enter product name");
                if(state.tempProduct.variants.length === 0) return alert("Add at least one variant");
                state.data.products.push(state.tempProduct);
                saveData();
                closeModal();
                render();
            };

            return `
            <div class="modal-overlay">
                <div class="modal-content fade-in">
                    <div class="modal-header">
                        <div class="modal-title">Add New Product</div>
                        <div class="modal-close" onclick="closeModal()">×</div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Product Name (e.g. Pepsi, Sugar)</label>
                        <input type="text" class="input-field" value="${state.tempProduct.name}" onchange="state.tempProduct.name=this.value">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Category (Optional)</label>
                        <input type="text" class="input-field" value="${state.tempProduct.category}" onchange="state.tempProduct.category=this.value">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Variants / Sizes</label>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="variant-input" class="input-field" placeholder="e.g. 1.5 Liter, 5kg" style="padding:12px;">
                            <button class="btn btn-secondary btn-small" onclick="addVariant()">Add</button>
                        </div>
                    </div>
                    <div style="margin-bottom:20px;">
                        ${state.tempProduct.variants.map((v, i) => `
                            <div class="variant-tag">
                                ${v} <span class="variant-tag-close" onclick="removeVariant(${i})">×</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary" onclick="saveProduct()">Save Product</button>
                </div>
            </div>
            `;
        },

        selectProduct: () => {
            const { products } = state.data;
            const pIndex = state.tempOrderSelection.productIndex;
            const p = products[pIndex];
            
            window.changeProduct = (idx) => {
                state.tempOrderSelection.productIndex = idx;
                state.tempOrderSelection.variant = products[idx].variants[0];
                renderModal('selectProduct');
            };
            window.changeVariant = (v) => {
                state.tempOrderSelection.variant = v;
                renderModal('selectProduct');
            };
            window.confirmAddCart = () => {
                state.cart.push({
                    productName: products[state.tempOrderSelection.productIndex].name,
                    variant: state.tempOrderSelection.variant,
                    qty: state.tempOrderSelection.qty
                });
                closeModal();
                render();
            };

            return `
            <div class="modal-overlay">
                <div class="modal-content fade-in">
                    <div class="modal-header">
                        <div class="modal-title">Select Product</div>
                        <div class="modal-close" onclick="closeModal()">×</div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Product</label>
                        <select class="input-field" onchange="changeProduct(parseInt(this.value))">
                            ${products.map((prod, idx) => `<option value="${idx}" ${idx === pIndex ? 'selected' : ''}>${prod.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Variant / Size</label>
                        <div class="variant-chips">
                            ${p.variants.map(v => `
                                <div class="chip ${state.tempOrderSelection.variant === v ? 'active' : ''}" onclick="changeVariant('${v}')">${v}</div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="input-group" style="margin-top:24px;">
                        <label class="input-label">Quantity</label>
                        <div class="qty-control" style="width:100%; justify-content:center; padding:10px;">
                            <button class="qty-btn" onclick="if(state.tempOrderSelection.qty>1){state.tempOrderSelection.qty--; renderModal('selectProduct');}">-</button>
                            <div class="qty-val" style="width:50px;">${state.tempOrderSelection.qty}</div>
                            <button class="qty-btn" onclick="state.tempOrderSelection.qty++; renderModal('selectProduct');">+</button>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="margin-top:20px;" onclick="confirmAddCart()">Add to Order</button>
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
        let html = '';
        const screenRenderer = screens[state.currentScreen];
        if (screenRenderer) html += screenRenderer();
        if (state.modal && modals[state.modal]) html += modals[state.modal]();
        app.innerHTML = html;
    };

    render();
});
