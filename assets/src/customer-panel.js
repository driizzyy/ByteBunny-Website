// Customer Panel JavaScript
class CustomerPanel {
    constructor() {
        this.apiBaseUrl = 'https://bytebunny-backend.onrender.com/api';
        this.currentUser = null;
        this.currentSection = 'overview';
        
        this.init();
    }

    async init() {
        this.setupNavigation();
        await this.loadUserData();
        this.hideLoading();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.panel-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionName) {
        // Update active nav link
        document.querySelectorAll('.panel-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.panel-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    async loadUserData() {
        try {
            // For demo purposes, using mock data
            // In production, this would fetch from your backend
            this.currentUser = {
                id: 'demo-user-123',
                username: 'DemoUser',
                email: 'demo@example.com',
                memberSince: '2024-01-15',
                lastLogin: new Date().toISOString(),
                activeLicenses: 2,
                totalDownloads: 15,
                discordId: '123456789012345678'
            };

            this.updateUserProfile();
            this.loadOverviewData();
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showError('Failed to load user data');
        }
    }

    updateUserProfile() {
        document.getElementById('userName').textContent = this.currentUser.username;
        document.getElementById('userEmail').textContent = this.currentUser.email;
    }

    loadOverviewData() {
        // Update stats
        document.getElementById('activeLicenses').textContent = this.currentUser.activeLicenses;
        document.getElementById('totalDownloads').textContent = this.currentUser.totalDownloads;
        document.getElementById('memberSince').textContent = new Date(this.currentUser.memberSince).toLocaleDateString();
        document.getElementById('lastLogin').textContent = new Date(this.currentUser.lastLogin).toLocaleDateString();

        // Load recent activity
        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        const activities = [
            {
                icon: 'fas fa-download',
                title: 'Downloaded ByteBunny Selfbot v2.1.0',
                time: '2 hours ago'
            },
            {
                icon: 'fas fa-key',
                title: 'License renewed for ByteBunny Premium',
                time: '1 day ago'
            },
            {
                icon: 'fas fa-user',
                title: 'Profile updated',
                time: '3 days ago'
            },
            {
                icon: 'fas fa-credit-card',
                title: 'Payment processed for Monthly License',
                time: '1 week ago'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.time}</p>
                </div>
            </div>
        `).join('');
    }

    async loadSectionData(section) {
        switch(section) {
            case 'licenses':
                this.loadLicenses();
                break;
            case 'downloads':
                this.loadDownloads();
                break;
            case 'billing':
                this.loadBillingData();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadLicenses() {
        const licensesList = document.getElementById('licensesList');
        const licenses = [
            {
                id: 'lic_001',
                productName: 'ByteBunny Selfbot Premium',
                productType: 'selfbot',
                licenseType: 'monthly',
                status: 'active',
                expiresAt: '2024-09-15',
                licenseKey: 'BB-PREM-****-****-1234'
            },
            {
                id: 'lic_002',
                productName: 'ByteBunny Admin Tools',
                productType: 'admin-tools',
                licenseType: 'yearly',
                status: 'active',
                expiresAt: '2025-01-15',
                licenseKey: 'BB-ADMIN-****-****-5678'
            }
        ];

        licensesList.innerHTML = licenses.map(license => `
            <div class="license-card">
                <div class="license-header">
                    <div class="license-info">
                        <h3>${license.productName}</h3>
                        <p>License Key: ${license.licenseKey}</p>
                    </div>
                    <span class="license-status ${license.status}">${license.status}</span>
                </div>
                <div class="license-details">
                    <div class="license-detail">
                        <span>Type:</span>
                        <span>${license.licenseType}</span>
                    </div>
                    <div class="license-detail">
                        <span>Expires:</span>
                        <span>${new Date(license.expiresAt).toLocaleDateString()}</span>
                    </div>
                    <div class="license-detail">
                        <span>Status:</span>
                        <span>${license.status}</span>
                    </div>
                </div>
                <div class="license-actions">
                    <button class="btn btn-primary btn-small" onclick="customerPanel.downloadProduct('${license.productType}')">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="customerPanel.renewLicense('${license.id}')">
                        <i class="fas fa-refresh"></i>
                        Renew
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadDownloads() {
        const downloadsList = document.getElementById('downloadsList');
        const downloads = [
            {
                name: 'ByteBunny Selfbot v2.1.0',
                type: 'executable',
                size: '15.2 MB',
                version: '2.1.0',
                icon: 'fas fa-rocket'
            },
            {
                name: 'ByteBunny Admin Tools v1.5.3',
                type: 'executable',
                size: '22.8 MB',
                version: '1.5.3',
                icon: 'fas fa-tools'
            },
            {
                name: 'User Documentation',
                type: 'pdf',
                size: '3.1 MB',
                version: 'latest',
                icon: 'fas fa-file-pdf'
            }
        ];

        downloadsList.innerHTML = downloads.map(download => `
            <div class="download-card">
                <div class="download-icon">
                    <i class="${download.icon}"></i>
                </div>
                <h3>${download.name}</h3>
                <p>Version: ${download.version}</p>
                <p>Size: ${download.size}</p>
                <button class="btn btn-primary" onclick="customerPanel.initiateDownload('${download.name}')">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            </div>
        `).join('');
    }

    loadBillingData() {
        const orderHistory = document.getElementById('orderHistory');
        const orders = [
            {
                id: 'ORD-001',
                product: 'ByteBunny Selfbot Premium',
                amount: '$19.99',
                date: '2024-08-15',
                status: 'completed'
            },
            {
                id: 'ORD-002',
                product: 'ByteBunny Admin Tools',
                amount: '$149.99',
                date: '2024-01-15',
                status: 'completed'
            }
        ];

        orderHistory.innerHTML = `
            <h3>Order History</h3>
            ${orders.map(order => `
                <div class="order-item">
                    <div>
                        <h4>${order.product}</h4>
                        <p>Order #${order.id} - ${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span class="order-amount">${order.amount}</span>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                </div>
            `).join('')}
        `;
    }

    loadSettings() {
        // Pre-fill form with user data
        document.getElementById('displayName').value = this.currentUser.username;
        document.getElementById('email').value = this.currentUser.email;

        // Setup form submission
        const profileForm = document.getElementById('profileForm');
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });
    }

    async updateProfile() {
        const displayName = document.getElementById('displayName').value;
        const email = document.getElementById('email').value;

        try {
            // In production, this would send data to your backend
            this.currentUser.username = displayName;
            this.currentUser.email = email;
            
            this.updateUserProfile();
            this.showSuccess('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showError('Failed to update profile');
        }
    }

    async downloadProduct(productType) {
        try {
            // In production, this would generate a secure download link
            this.showInfo('Download link will be provided via Discord. Please contact support.');
            openDiscordSupport();
        } catch (error) {
            console.error('Error initiating download:', error);
            this.showError('Failed to initiate download');
        }
    }

    async renewLicense(licenseId) {
        try {
            // Redirect to Discord for license renewal
            this.showInfo('License renewal is handled through Discord. Redirecting...');
            setTimeout(() => {
                openDiscordSupport();
            }, 2000);
        } catch (error) {
            console.error('Error renewing license:', error);
            this.showError('Failed to initiate renewal');
        }
    }

    async initiateDownload(fileName) {
        try {
            // In production, this would generate a secure download link
            this.showInfo(`Download for ${fileName} will be provided via Discord. Please contact support.`);
            openDiscordSupport();
        } catch (error) {
            console.error('Error initiating download:', error);
            this.showError('Failed to initiate download');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--background-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Global function to open Discord support
function openDiscordSupport() {
    try {
        // Get Discord invite from config or use fallback
        const discordInvite = 'https://discord.gg/mcNjvmvkWD'; // Replace with your actual invite
        window.open(discordInvite, '_blank');
    } catch (error) {
        console.error('Error opening Discord:', error);
    }
}

// Add notification animations
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary);
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-error {
        border-left: 4px solid #ef4444;
    }

    .notification-info {
        border-left: 4px solid #3b82f6;
    }

    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }

    .notification-close:hover {
        color: var(--text-primary);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize customer panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.customerPanel = new CustomerPanel();
});

// Initialize navigation for mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
});
