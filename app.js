document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const defaultData = {
        products: [],
        orders: [],
        settings: {
            ownerPhone: "923364459040",
            salesmanName: "Dawood Sales"
        }
    };

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
        tempOrderSelection: { productIndex: -1, variant: '', qty: 1, isCustom: false, customName: '', customVariant: '' }
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
            <div class="nav-item ${activeTab === 'products' ? 'active' : ''}" onclick="navigate('products')">
                <div class="nav-icon icon-products"></div>Items
            </div>
            <div class="nav-item fab" onclick="navigate('new_order')">
                <div class="nav-icon icon-add"></div>
            </div>
            <div class="nav-item ${activeTab === 'orders' ? 'active' : ''}" onclick="navigate('orders')">
                <div class="nav-icon icon-order"></div>Orders
            </div>
            <div class="nav-item ${activeTab === 'settings' ? 'active' : ''}" onclick="navigate('settings')">
                <div class="nav-icon icon-settings"></div>Settings
            </div>
        </div>
    `;

    const screens = {
        dashboard: () => {
            const { orders, products } = state.data;
            const pendingOrders = orders.filter(o => o.status === 'Pending').length;
            const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

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
                        <div class="stat-value" style="color:var(--primary-color)">${orders.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Total Items</div>
                        <div class="stat-value">${products.length}</div>
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
                    ${orders.length === 0 ? `<div class="empty-state">No orders yet. Start booking!</div>` : ''}
                    ${orders.slice().reverse().slice(0, 5).map(order => `
                        <div class="list-item">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="item-icon">${order.shop.charAt(0)}</div>
                                <div>
                                    <div style="font-weight:600; font-size:16px;">${order.shop}</div>
                                    <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${order.items.length} items • ${order.date}</div>
                                </div>
                            </div>
                            <div style="color:var(--primary-color); font-weight:600; font-size:13px;">${order.status}</div>
                        </div>
                    `).join('')}
                </div>
                ${getBottomNav('dashboard')}
            </div>
            `;
        },

        products: () => {
            const { products } = state.data;
            window.openAddProduct = () => {
                state.tempProduct = { id: Date.now(), name: '', category: '', variants: [] };
                renderModal('addProduct');
            };
            window.deleteProduct = (id) => {
                if(confirm('Delete this item?')) {
                    state.data.products = state.data.products.filter(p => p.id !== id);
                    saveData();
                    render();
                }
            };
            return `
            <div class="fade-in">
                <div class="header">
                    <div class="header-title">Items / Products</div>
                </div>
                <div class="list-section" style="padding-top:0">
                    <button class="btn btn-primary" style="margin-bottom:20px;" onclick="openAddProduct()">
                        <div class="icon-add" style="width:20px; height:20px; background:white; -webkit-mask-size:cover; mask-size:cover;"></div>
                        Add New Item
                    </button>
                    
                    ${products.length === 0 ? `<div class="empty-state">No items available. Please add new items.</div>` : ''}
                    
                    ${products.map(p => `
                        <div class="list-item product-item">
                            <div class="product-header">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div class="item-icon">${p.name.charAt(0)}</div>
                                    <div>
                                        <div style="font-weight:600; font-size:16px;">${p.name}</div>
                                        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Variants: ${p.variants.join(', ')}</div>
                                    </div>
                                </div>
                                <div style="color:var(--danger); font-size:24px; padding:0 10px; cursor:pointer;" onclick="deleteProduct(${p.id})">×</div>
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
                            <div style="background:var(--bg-color); padding:10px; border-radius:8px; font-size:13px; line-height:1.6;">
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
                    
                    <button class="btn btn-danger" style="margin-top:40px;" onclick="
                        if(confirm('Are you sure you want to delete all data?')) {
                            localStorage.removeItem('dawood_data');
                            window.location.reload();
                        }
                    ">Reset All App Data</button>
                </div>
                ${getBottomNav('settings')}
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
            
            window.openProductSelector = () => {
                state.tempOrderSelection = { productIndex: 0, variant: '', qty: 1, isCustom: state.data.products.length === 0, customName: '', customVariant: '' };
                if (state.data.products.length > 0) {
                    state.tempOrderSelection.variant = state.data.products[0].variants[0];
                }
                renderModal('selectProduct');
            };

            window.sendWhatsApp = () => {
                const { shopName, shopPhone, address } = state.orderForm;
                if(!shopName) return alert("Please enter Shop Name");
                if(state.cart.length === 0) return alert("Please add at least one item");
                
                let text = `📦 *New Booking*%0A%0A`;
                text += `👤 *Salesman:* ${state.data.settings.salesmanName}%0A%0A`;
                text += `🏪 *Shop Name:*%0A${shopName}%0A%0A`;
                if(shopPhone) text += `📞 *Phone:*%0A${shopPhone}%0A%0A`;
                if(address) text += `📍 *Address:*%0A${address}%0A%0A`;
                
                text += `🛒 *Order Details:*%0A`;
                state.cart.forEach((item) => {
                    text += `• ${item.productName} ${item.variant ? '('+item.variant+')' : ''} x${item.qty}%0A`;
                });
                text += `%0A🚚 *Please Prepare Dispatch*`;

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

                    <div style="margin: 24px 0 16px; font-size:16px; font-weight:700; color:var(--primary-color)">Selected Items</div>

                    ${state.cart.length === 0 ? `<div class="empty-state" style="padding:20px; border:1px dashed var(--border-color); border-radius:12px; margin-bottom:16px;">Cart is empty</div>` : ''}

                    ${state.cart.map((item, idx) => `
                        <div class="order-item-card fade-in">
                            <div class="remove-item" onclick="removeFromCart(${idx})">×</div>
                            <div style="font-weight:600; font-size:16px; margin-bottom:4px;">${item.productName}</div>
                            ${item.variant ? `<div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Size: ${item.variant}</div>` : `<div style="height:12px;"></div>`}
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
                                <div class="qty-val">${item.qty}</div>
                                <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
                            </div>
                        </div>
                    `).join('')}

                    <button class="btn btn-secondary" onclick="openProductSelector()" style="margin-bottom: 30px;">
                        + Add Item to Order
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
                if(!state.tempProduct.name) return alert("Enter item name");
                if(state.tempProduct.variants.length === 0) return alert("Add at least one size/variant (e.g. 1kg, 1L)");
                state.data.products.push(state.tempProduct);
                saveData();
                closeModal();
                render();
            };

            return `
            <div class="modal-overlay">
                <div class="modal-content fade-in">
                    <div class="modal-header">
                        <div class="modal-title">Add New Item</div>
                        <div class="modal-close" onclick="closeModal()">×</div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Item Name (e.g. Pepsi, Sugar)</label>
                        <input type="text" class="input-field" value="${state.tempProduct.name}" onchange="state.tempProduct.name=this.value">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Variants / Sizes</label>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="variant-input" class="input-field" placeholder="e.g. 1.5 L, 5 kg" style="padding:12px;">
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
                    <button class="btn btn-primary" onclick="saveProduct()">Save Item</button>
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
                    if (!selection.customName) return alert("Enter item name");
                    state.cart.push({
                        productName: selection.customName,
                        variant: selection.customVariant,
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
                        <div class="modal-title">Select Item</div>
                        <div class="modal-close" onclick="closeModal()">×</div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Item</label>
                        <select class="input-field" onchange="changeProduct(parseInt(this.value))">
                            ${products.map((prod, idx) => `<option value="${idx}" ${!selection.isCustom && idx === pIndex ? 'selected' : ''}>${prod.name}</option>`).join('')}
                            <option value="-1" ${selection.isCustom ? 'selected' : ''} style="font-weight:bold;">+ Add Custom Item...</option>
                        </select>
                    </div>

                    ${selection.isCustom ? `
                        <div class="input-group fade-in">
                            <label class="input-label">Custom Item Name</label>
                            <input type="text" class="input-field" placeholder="e.g. Local Biscuits" value="${selection.customName}" onchange="state.tempOrderSelection.customName=this.value">
                        </div>
                        <div class="input-group fade-in">
                            <label class="input-label">Size / Variant (Optional)</label>
                            <input type="text" class="input-field" placeholder="e.g. 1 Box" value="${selection.customVariant}" onchange="state.tempOrderSelection.customVariant=this.value">
                        </div>
                    ` : `
                        <div class="input-group fade-in">
                            <label class="input-label">Variant / Size</label>
                            <div class="variant-chips">
                                ${p ? p.variants.map(v => `
                                    <div class="chip ${selection.variant === v ? 'active' : ''}" onclick="changeVariant('${v}')">${v}</div>
                                `).join('') : ''}
                            </div>
                        </div>
                    `}

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
