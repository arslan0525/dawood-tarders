document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const renderScreen = (screenName) => {
        app.innerHTML = '';
        if (screenName === 'splash') {
            app.innerHTML = `
                <div class="splash-screen">
                    <div class="splash-logo">D</div>
                    <div class="splash-title">Dawood Trader</div>
                    <div class="splash-subtitle">Wholesale Order Management</div>
                </div>
            `;
            setTimeout(() => renderScreen('dashboard'), 2000);
        } else if (screenName === 'dashboard') {
            app.innerHTML = `
                <div class="header">
                    <div class="header-title">Dashboard</div>
                    <div style="background:var(--card-bg); padding:8px 16px; border-radius:20px; font-size:14px; font-weight:600; color:var(--primary-color);">Admin</div>
                </div>
                
                <div class="cards-grid">
                    <div class="stat-card">
                        <div class="stat-title">Total Orders</div>
                        <div class="stat-value" style="color:var(--primary-color)">124</div>
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
                        <div class="stat-value">104</div>
                    </div>
                </div>

                <div style="padding: 24px 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <div style="font-size:18px; font-weight:700;">Recent Orders</div>
                        <div style="font-size:14px; color:var(--primary-color); font-weight:500;">See All</div>
                    </div>
                    
                    <div style="background:var(--card-bg); padding:16px; border-radius:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; border: 1px solid #2a2a2a;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:40px; height:40px; background:#2a2a2a; border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--primary-color); font-weight:700;">A</div>
                            <div>
                                <div style="font-weight:600; font-size:16px;">Shop A Market</div>
                                <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">3 items • Today</div>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:var(--text-primary); font-weight:700; font-size:16px;">Rs. 4,500</div>
                            <div style="color:#FFA500; font-size:12px; margin-top:2px; font-weight:500;">Pending</div>
                        </div>
                    </div>

                    <div style="background:var(--card-bg); padding:16px; border-radius:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; border: 1px solid #2a2a2a;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:40px; height:40px; background:#2a2a2a; border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--primary-color); font-weight:700;">K</div>
                            <div>
                                <div style="font-weight:600; font-size:16px;">Khan Traders</div>
                                <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">12 items • Yesterday</div>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:var(--text-primary); font-weight:700; font-size:16px;">Rs. 18,200</div>
                            <div style="color:#4CAF50; font-size:12px; margin-top:2px; font-weight:500;">Delivered</div>
                        </div>
                    </div>
                </div>

                <div class="bottom-nav">
                    <div class="nav-item active">
                        <div class="nav-icon icon-home"></div>
                        Home
                    </div>
                    <div class="nav-item fab" onclick="alert('New Order logic will go here')">
                        <div class="nav-icon icon-add"></div>
                    </div>
                    <div class="nav-item">
                        <div class="nav-icon icon-order"></div>
                        Orders
                    </div>
                </div>
            `;
        }
    };

    renderScreen('splash');
});
