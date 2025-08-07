// Navigation functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize configuration manager
    const configManager = new ConfigManager();
    await configManager.loadConfig();
    
    // Update all links with configuration
    configManager.updatePageLinks();
    
    // Add click tracking
    configManager.addClickTracking();

    // Customer Panel button functionality
    const customerPanelBtn = document.getElementById('customer-panel-btn');
    if (customerPanelBtn) {
        customerPanelBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const links = await configManager.getLinks();
                const panelLink = links.website.customer_panel;
                
                if (panelLink && panelLink !== '#') {
                    window.open(panelLink, '_blank');
                } else {
                    // Show placeholder message
                    showPanelPlaceholder();
                }
            } catch (error) {
                console.error('Error accessing customer panel:', error);
                showPanelPlaceholder();
            }
        });
    }

    function showPanelPlaceholder() {
        // Create a stylish placeholder modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--background-card);
            padding: 3rem;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-color);">
                <i class="fas fa-tools"></i>
            </div>
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.5rem;">
                Coming Soon!
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                The Customer Web Panel is currently under development. 
                Stay tuned for exciting new features including license management, 
                download access, and account settings!
            </p>
            <button id="close-modal" style="
                background: var(--gradient-primary);
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            ">
                Got it!
            </button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Close functionality
        const closeBtn = modalContent.querySelector('#close-modal');
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an external link or anchor link
            if (href.includes('index.html') || href.startsWith('http') || href.startsWith('../')) {
                // Allow default navigation for external links
                return;
            }
            
            // Handle anchor links on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
        }
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .team-member, .roadmap-item, .community-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Terminal typing effect
    const terminalLines = document.querySelectorAll('.terminal-line');
    let delay = 0;
    
    terminalLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.animation = 'typeIn 0.5s ease-out';
        }, delay);
        delay += 800;
    });

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });

    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        updateCounter();
    }

    // Trigger counter animation when stats are visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    const originalText = statNumber.textContent;
                    const target = parseInt(originalText);
                    
                    // Only animate if it's a pure number (like 50)
                    if (!isNaN(target) && originalText.match(/^\d+\+?$/)) {
                        animateCounter(statNumber, target);
                    }
                    // For non-numeric stats (24/7, 7 Day), leave them as-is
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats .stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add parallax effect to hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add loading animation for hero card and banner
    setTimeout(() => {
        const heroCard = document.querySelector('.hero-card');
        const heroBanner = document.querySelector('.hero-banner');
        if (heroCard) {
            heroCard.style.opacity = '1';
            heroCard.style.transform = 'translateY(0)';
        }
        if (heroBanner) {
            heroBanner.style.opacity = '1';
            heroBanner.style.transform = 'translateY(0)';
        }
    }, 500);

    // Initialize hero elements with hidden state
    const heroCard = document.querySelector('.hero-card');
    const heroBanner = document.querySelector('.hero-banner');
    if (heroCard) {
        heroCard.style.opacity = '0';
        heroCard.style.transform = 'translateY(30px)';
        heroCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    if (heroBanner) {
        heroBanner.style.opacity = '0';
        heroBanner.style.transform = 'translateY(20px)';
        heroBanner.style.transition = 'opacity 1s ease, transform 1s ease';
    }

    // Add gradient text animation
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', function() {
            this.style.backgroundSize = '200% 200%';
            this.style.animation = 'gradientShift 2s ease infinite';
        });
        
        text.addEventListener('mouseleave', function() {
            this.style.animation = '';
            this.style.backgroundSize = '100% 100%';
        });
    });

    // Add copy functionality for Discord link
    const discordLinks = document.querySelectorAll('a[href*="discord.gg"]');
    discordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow normal navigation but add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Add dynamic theme switching based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
        // Daytime - slightly lighter theme
        document.documentElement.style.setProperty('--background-primary', '#111111');
        document.documentElement.style.setProperty('--background-secondary', '#1f1f1f');
    }
});

// Add CSS for additional animations
const additionalStyles = `
    @keyframes typeIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Packages functionality
class PackageManager {
    constructor() {
        this.configManager = new ConfigManager();
        this.packagesData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadPackages();
            this.renderPackages();
        } catch (error) {
            console.error('Failed to load packages:', error);
        }
    }

    async loadPackages() {
        try {
            const response = await fetch('assets/config/packages.json');
            this.packagesData = await response.json();
        } catch (error) {
            console.error('Error loading packages:', error);
            // Fallback data if file doesn't load
            this.packagesData = {
                packages: {
                    basic_bunny: {
                        name: "Basic Bunny",
                        description: "Essential Discord enhancement features",
                        color: "#10b981",
                        icon: "fas fa-rabbit",
                        features: ["Core selfbot functionality", "Basic automation", "Message management"],
                        pricing: {
                            "1_month": { duration: "1 Month", price: "$19.99", popular: true }
                        }
                    }
                },
                settings: { support_contact: "general_support" }
            };
        }
    }

    renderPackages() {
        const container = document.getElementById('packages-container');
        if (!container || !this.packagesData) return;

        const packages = this.packagesData.packages;
        let html = '';

        Object.keys(packages).forEach(packageKey => {
            const pkg = packages[packageKey];
            html += this.createPackageHTML(packageKey, pkg);
        });

        container.innerHTML = html;
        this.attachEventListeners();
    }

    createPackageHTML(packageKey, pkg) {
        const featuresHTML = pkg.features.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('');

        const pricingHTML = Object.keys(pkg.pricing).map(priceKey => {
            const price = pkg.pricing[priceKey];
            const popularClass = price.popular ? ' popular' : '';
            return `
                <div class="pricing-option${popularClass}" data-package="${packageKey}" data-duration="${priceKey}">
                    <div class="pricing-duration">${price.duration}</div>
                    <div class="pricing-price">${price.price}</div>
                    <button class="buy-btn" onclick="packageManager.handlePurchase('${packageKey}', '${priceKey}')">
                        Buy Now
                    </button>
                </div>
            `;
        }).join('');

        return `
            <div class="package-tier" style="--package-color: ${pkg.color}">
                <div class="package-header">
                    <i class="${pkg.icon} package-icon"></i>
                    <h3 class="package-name">${pkg.name}</h3>
                    <p class="package-description">${pkg.description}</p>
                </div>
                <div class="package-features">
                    <h4><i class="fas fa-star"></i> Features Included</h4>
                    <ul class="features-list">
                        ${featuresHTML}
                    </ul>
                    <div class="pricing-grid">
                        ${pricingHTML}
                    </div>
                </div>
            </div>
        `;
    }

    async handlePurchase(packageKey, durationKey) {
        try {
            // Get support channel link from config
            const links = await this.configManager.getLinks();
            const supportLink = links.discord.channels.general_support;
            
            if (supportLink) {
                // Open support channel in new tab
                window.open(supportLink, '_blank');
            } else {
                // Fallback to main Discord server
                window.open('https://discord.gg/mcNjvmvkWD', '_blank');
            }
        } catch (error) {
            console.error('Error handling purchase:', error);
            // Fallback to main Discord server
            window.open('https://discord.gg/mcNjvmvkWD', '_blank');
        }
    }

    attachEventListeners() {
        // Add hover effects for pricing options
        const pricingOptions = document.querySelectorAll('.pricing-option');
        pricingOptions.forEach(option => {
            option.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            option.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add package tier animations
        const packageTiers = document.querySelectorAll('.package-tier');
        packageTiers.forEach((tier, index) => {
            tier.style.opacity = '0';
            tier.style.transform = 'translateY(30px)';
            tier.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            tier.style.animationDelay = `${index * 0.2}s`;

            // Trigger animation when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(tier);
        });
    }
}

// Initialize package manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.packageManager = new PackageManager();
});
