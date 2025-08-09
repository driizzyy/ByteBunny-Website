// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.apiBaseUrl = 'https://your-render-backend.onrender.com/api';
        this.token = localStorage.getItem('authToken');
        this.currentUser = null;
        this.currentSection = 'overview';
        
        this.init();
    }

    async init() {
        // Check authentication status
        if (!this.token) {
            this.showLoginModal();
            return;
        }

        try {
            // Verify token and get user data
            await this.verifyAuth();
            await this.loadDashboard();
        } catch (error) {
            console.error('Authentication failed:', error);
            this.showLoginModal();
        }
    }

    async verifyAuth() {
        const response = await fetch(`${this.apiBaseUrl}/auth/user`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        this.currentUser = await response.json();
        this.updateUserDisplay();
    }

    updateUserDisplay() {
        const usernameDisplay = document.getElementById('usernameDisplay');
        const userAvatar = document.getElementById('userAvatar');
        
        if (usernameDisplay && this.currentUser) {
            usernameDisplay.textContent = this.currentUser.username;
        }
        
        if (userAvatar && this.currentUser.avatar) {
            userAvatar.src = this.currentUser.avatar;
        }
    }

    async loadDashboard() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        await this.loadOverviewData();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // User menu
        const userMenuToggle = document.getElementById('userMenuToggle');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuToggle && userDropdown) {
            userMenuToggle.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuToggle.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Forms
        this.setupForms();

        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Download categories
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterDownloads(btn.getAttribute('data-category'));
            });
        });
    }

    setupForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister(e);
            });
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleProfileUpdate(e);
            });
        }
    }

    async handleLogin(e) {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.currentUser = data.user;
            
            this.closeModal('loginModal');
            await this.loadDashboard();
            this.showNotification('Welcome back!', 'success');

        } catch (error) {
            console.error('Login error:', error);
            this.showNotification(error.message, 'error');
        }
    }

    async handleRegister(e) {
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const discordId = document.getElementById('regDiscordId').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, discordId, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.currentUser = data.user;
            
            this.closeModal('registerModal');
            await this.loadDashboard();
            this.showNotification('Account created successfully!', 'success');

        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification(error.message, 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const updateData = Object.fromEntries(formData);

        try {
            const response = await fetch(`${this.apiBaseUrl}/dashboard/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Update failed');
            }

            this.currentUser = data.user;
            this.updateUserDisplay();
            this.showNotification('Profile updated successfully!', 'success');

        } catch (error) {
            console.error('Profile update error:', error);
            this.showNotification(error.message, 'error');
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'licenses':
                this.loadLicenses();
                break;
            case 'downloads':
                this.loadDownloads();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    async loadOverviewData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }

            const data = await response.json();
            this.updateOverviewStats(data.stats);
            this.loadRecentActivity();
            this.loadNotifications();

        } catch (error) {
            console.error('Error loading overview:', error);
            this.showNotification('Failed to load dashboard data', 'error');
        }
    }

    updateOverviewStats(stats) {
        document.getElementById('activeLicenses').textContent = stats.activeLicenses;
        document.getElementById('totalDownloads').textContent = stats.totalDownloads;
        document.getElementById('membershipStatus').textContent = stats.membershipStatus;
        
        const memberSince = new Date(stats.accountCreated).toLocaleDateString();
        document.getElementById('memberSince').textContent = memberSince;
    }

    async loadRecentActivity() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/dashboard/activity?limit=5`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load activity');
            }

            const data = await response.json();
            this.updateActivityList(data.activities);

        } catch (error) {
            console.error('Error loading activity:', error);
        }
    }

    updateActivityList(activities) {
        const activityList = document.getElementById('activityList');
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <p>No recent activity</p>
                        <span class="activity-time">Get started by purchasing a license!</span>
                    </div>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.type === 'license' ? 'key' : 'download'}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.action} ${activity.item}</p>
                    <span class="activity-time">${this.formatDate(activity.date)}</span>
                </div>
            </div>
        `).join('');
    }

    async loadNotifications() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/dashboard/notifications`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load notifications');
            }

            const data = await response.json();
            this.updateNotificationsList(data.notifications);

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    updateNotificationsList(notifications) {
        const notificationsList = document.getElementById('notificationsList');
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="notification-content">
                        <p>No new notifications</p>
                    </div>
                </div>
            `;
            return;
        }

        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-${notification.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <p><strong>${notification.title}</strong></p>
                    <p>${notification.message}</p>
                    ${notification.action ? `<a href="${notification.action.link}" class="btn btn-sm">${notification.action.text}</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    async loadLicenses() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/dashboard/licenses`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load licenses');
            }

            const data = await response.json();
            this.updateLicensesGrid(data.licenses);

        } catch (error) {
            console.error('Error loading licenses:', error);
            this.showNotification('Failed to load licenses', 'error');
        }
    }

    updateLicensesGrid(licenses) {
        const licensesGrid = document.getElementById('licensesGrid');
        
        if (licenses.length === 0) {
            licensesGrid.innerHTML = `
                <div class="loading-placeholder">
                    <i class="fas fa-key"></i>
                    <p>No licenses found</p>
                    <a href="../../index.html#packages" class="btn btn-primary">Purchase License</a>
                </div>
            `;
            return;
        }

        licensesGrid.innerHTML = licenses.map(license => `
            <div class="license-card ${license.isActive ? 'active' : license.daysRemaining <= 7 ? 'expiring' : 'expired'}">
                <div class="license-header">
                    <h3 class="license-title">${license.productName}</h3>
                    <span class="license-status status-${license.isActive ? 'active' : license.daysRemaining <= 7 ? 'expiring' : 'expired'}">
                        ${license.isActive ? 'Active' : license.daysRemaining <= 7 ? 'Expiring' : 'Expired'}
                    </span>
                </div>
                <div class="license-info">
                    <p>License Key: <span>${license.licenseKey}</span></p>
                    <p>Type: <span>${license.licenseType}</span></p>
                    <p>Expires: <span>${this.formatDate(license.expiresAt)}</span></p>
                    <p>Days Remaining: <span>${license.daysRemaining}</span></p>
                </div>
                <div class="license-actions">
                    ${license.isActive ? 
                        `<a href="#" class="btn-license btn-download" onclick="dashboard.downloadSoftware('${license.productType}')">
                            <i class="fas fa-download"></i> Download
                        </a>` : 
                        `<a href="../../index.html#packages" class="btn-license btn-renew">
                            <i class="fas fa-refresh"></i> Renew
                        </a>`
                    }
                </div>
            </div>
        `).join('');
    }

    async loadDownloads() {
        // For demo purposes, showing static download items
        // In production, this would fetch from the API
        const downloadsGrid = document.getElementById('downloadsGrid');
        
        const staticDownloads = [
            {
                id: 1,
                name: 'ByteBunny Selfbot',
                version: 'v2.1.0',
                description: 'Advanced Discord selfbot with comprehensive features',
                icon: 'robot',
                category: 'selfbot',
                fileSize: '15.2 MB',
                downloads: 1234,
                updatedAt: new Date()
            },
            {
                id: 2,
                name: 'Admin Tools Suite',
                version: 'v1.8.3',
                description: 'Complete administrative toolkit for server management',
                icon: 'tools',
                category: 'admin',
                fileSize: '8.7 MB',
                downloads: 567,
                updatedAt: new Date()
            },
            {
                id: 3,
                name: 'Moderation Plugin',
                version: 'v1.4.1',
                description: 'Enhanced moderation capabilities and auto-mod features',
                icon: 'shield-alt',
                category: 'plugins',
                fileSize: '3.2 MB',
                downloads: 890,
                updatedAt: new Date()
            }
        ];

        downloadsGrid.innerHTML = staticDownloads.map(download => `
            <div class="download-card" data-category="${download.category}">
                <div class="download-header">
                    <div class="download-icon">
                        <i class="fas fa-${download.icon}"></i>
                    </div>
                    <div class="download-info">
                        <h3>${download.name}</h3>
                        <span class="download-version">${download.version}</span>
                    </div>
                </div>
                <p class="download-description">${download.description}</p>
                <div class="download-meta">
                    <span>Size: ${download.fileSize}</span>
                    <span>Downloads: ${download.downloads}</span>
                </div>
                <a href="#" class="btn-download-file" onclick="dashboard.downloadFile('${download.id}')">
                    <i class="fas fa-download"></i>
                    Download Now
                </a>
            </div>
        `).join('');
    }

    filterDownloads(category) {
        const downloadCards = document.querySelectorAll('.download-card');
        
        downloadCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    loadProfile() {
        if (!this.currentUser) return;

        document.getElementById('username').value = this.currentUser.username || '';
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('discordId').value = this.currentUser.discordId || '';
        document.getElementById('bio').value = this.currentUser.bio || '';
    }

    async downloadSoftware(productType) {
        try {
            // In production, this would make an API call to generate a secure download link
            this.showNotification('Generating download link...', 'info');
            
            // Simulate download
            setTimeout(() => {
                this.showNotification('Download started!', 'success');
            }, 1500);

        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Download failed. Please try again.', 'error');
        }
    }

    async downloadFile(fileId) {
        try {
            this.showNotification('Preparing download...', 'info');
            
            // Simulate download process
            setTimeout(() => {
                this.showNotification('Download completed!', 'success');
            }, 2000);

        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Download failed. Please try again.', 'error');
        }
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showRegisterModal() {
        this.closeModal('loginModal');
        this.showModal('registerModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        this.token = null;
        this.currentUser = null;
        
        this.showNotification('Logged out successfully', 'success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// Global functions for onclick handlers
window.showSection = function(section) {
    if (window.dashboard) {
        window.dashboard.showSection(section);
    }
};

window.closeModal = function(modalId) {
    if (window.dashboard) {
        window.dashboard.closeModal(modalId);
    }
};

window.showLoginModal = function() {
    if (window.dashboard) {
        window.dashboard.showLoginModal();
    }
};

window.showRegisterModal = function() {
    if (window.dashboard) {
        window.dashboard.showRegisterModal();
    }
};

window.openTicketModal = function() {
    if (window.dashboard) {
        window.dashboard.showNotification('Ticket system coming soon!', 'info');
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Add notification styles to document head
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid rgba(255, 71, 87, 0.3);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    font-weight: 500;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 10001;
    max-width: 400px;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.1);
}

.notification-error {
    border-color: rgba(255, 71, 87, 0.5);
    background: rgba(255, 71, 87, 0.1);
}

.notification-info {
    border-color: rgba(112, 161, 255, 0.5);
    background: rgba(112, 161, 255, 0.1);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification-success .notification-content i {
    color: var(--success-color);
}

.notification-error .notification-content i {
    color: var(--error-color);
}

.notification-info .notification-content i {
    color: var(--accent-color);
}

.notification-close {
    position: absolute;
    top: 0.5rem;
    right: 0.8rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.3s ease;
}

.notification-close:hover {
    color: var(--primary-color);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);
