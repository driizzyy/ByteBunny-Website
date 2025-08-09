// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createCartUI();
        this.updateCartDisplay();
        this.attachEventListeners();
    }

    createCartUI() {
        // Create cart icon and counter
        const cartHTML = `
            <div id="shopping-cart-widget" class="cart-widget">
                <button id="cart-toggle" class="cart-toggle">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cart-count" class="cart-count">0</span>
                </button>
                
                <div id="cart-dropdown" class="cart-dropdown">
                    <div class="cart-header">
                        <h3>Shopping Cart</h3>
                        <button id="cart-close" class="cart-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div id="cart-items" class="cart-items">
                        <!-- Cart items will be inserted here -->
                    </div>
                    
                    <div class="cart-footer">
                        <div class="cart-total">
                            <strong>Total: <span id="cart-total">$0.00</span></strong>
                        </div>
                        <div class="cart-actions">
                            <button id="clear-cart" class="btn btn-secondary btn-small">Clear Cart</button>
                            <button id="checkout-btn" class="btn btn-primary">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to navbar or create floating widget
        const navbar = document.querySelector('.navbar .nav-container');
        if (navbar) {
            navbar.insertAdjacentHTML('beforeend', cartHTML);
        }

        // Add cart styles
        this.addCartStyles();
    }

    addCartStyles() {
        const cartStyles = `
            .cart-widget {
                position: relative;
                z-index: 1000;
            }

            .cart-toggle {
                background: var(--gradient-primary);
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                color: white;
                cursor: pointer;
                position: relative;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .cart-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
            }

            .cart-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ffa502;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                min-width: 20px;
            }

            .cart-count.hidden {
                display: none;
            }

            .cart-dropdown {
                position: absolute;
                top: 60px;
                right: 0;
                width: 350px;
                background: var(--background-card);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1001;
                max-height: 500px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .cart-dropdown.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .cart-header {
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .cart-header h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1.1rem;
            }

            .cart-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .cart-close:hover {
                background: var(--background-secondary);
                color: var(--text-primary);
            }

            .cart-items {
                flex: 1;
                max-height: 300px;
                overflow-y: auto;
                padding: 0.5rem;
            }

            .cart-item {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                background: var(--background-secondary);
                transition: all 0.3s ease;
            }

            .cart-item:hover {
                background: var(--background-primary);
            }

            .cart-item-info {
                flex: 1;
                margin-right: 1rem;
            }

            .cart-item-name {
                color: var(--text-primary);
                font-weight: 600;
                margin: 0 0 0.25rem 0;
                font-size: 0.9rem;
            }

            .cart-item-details {
                color: var(--text-secondary);
                font-size: 0.8rem;
                margin: 0;
            }

            .cart-item-price {
                color: var(--primary-color);
                font-weight: 600;
                margin-right: 0.5rem;
            }

            .cart-item-remove {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .cart-item-remove:hover {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }

            .cart-footer {
                padding: 1rem;
                border-top: 1px solid var(--border-color);
                background: var(--background-secondary);
            }

            .cart-total {
                margin-bottom: 1rem;
                text-align: center;
                color: var(--text-primary);
                font-size: 1.1rem;
            }

            .cart-actions {
                display: flex;
                gap: 0.5rem;
            }

            .cart-actions .btn {
                flex: 1;
            }

            .cart-empty {
                padding: 2rem;
                text-align: center;
                color: var(--text-secondary);
            }

            .cart-empty i {
                font-size: 2rem;
                margin-bottom: 1rem;
                opacity: 0.5;
            }

            @media (max-width: 768px) {
                .cart-dropdown {
                    width: 90vw;
                    right: -20px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = cartStyles;
        document.head.appendChild(styleSheet);
    }

    attachEventListeners() {
        const cartToggle = document.getElementById('cart-toggle');
        const cartClose = document.getElementById('cart-close');
        const clearCart = document.getElementById('clear-cart');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        if (clearCart) {
            clearCart.addEventListener('click', () => this.clearCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartWidget = document.getElementById('shopping-cart-widget');
            if (cartWidget && !cartWidget.contains(e.target)) {
                this.closeCart();
            }
        });

        // Add to cart buttons on packages
        this.attachPackageButtons();
    }

    attachPackageButtons() {
        // Add "Add to Cart" buttons to existing buy buttons
        const buyButtons = document.querySelectorAll('.buy-btn');
        buyButtons.forEach(button => {
            // Replace buy button with add to cart
            const newButton = button.cloneNode(true);
            newButton.textContent = 'Add to Cart';
            newButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const packageElement = button.closest('.pricing-option') || button.closest('.package-tier');
                if (packageElement) {
                    const packageKey = packageElement.dataset.package;
                    const durationKey = packageElement.dataset.duration;
                    this.addToCartFromPackage(packageKey, durationKey, button);
                }
            });
            
            button.parentNode.replaceChild(newButton, button);
        });
    }

    addToCartFromPackage(packageKey, durationKey, buttonElement) {
        // Extract package information from the page
        const packageElement = buttonElement.closest('.package-tier') || buttonElement.closest('.pricing-option');
        const packageName = packageElement.querySelector('.package-name')?.textContent || 
                           packageElement.closest('.package-tier')?.querySelector('.package-name')?.textContent || 
                           'Unknown Package';
        
        const priceElement = packageElement.querySelector('.pricing-price') || 
                            packageElement.querySelector('.order-amount');
        const price = priceElement?.textContent || '$0.00';
        
        const durationElement = packageElement.querySelector('.pricing-duration');
        const duration = durationElement?.textContent || durationKey;

        const item = {
            id: `${packageKey}_${durationKey}_${Date.now()}`,
            packageKey: packageKey,
            durationKey: durationKey,
            name: packageName,
            duration: duration,
            price: price,
            addedAt: new Date().toISOString()
        };

        this.addItem(item);
    }

    addItem(item) {
        this.items.push(item);
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedToCartAnimation();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Update cart count
        if (cartCount) {
            cartCount.textContent = this.items.length;
            cartCount.classList.toggle('hidden', this.items.length === 0);
        }

        // Update cart items
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <p class="cart-item-details">${item.duration}</p>
                        </div>
                        <span class="cart-item-price">${item.price}</span>
                        <button class="cart-item-remove" onclick="shoppingCart.removeItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }

        // Update total (simplified - in production you'd calculate properly)
        if (cartTotal) {
            const total = this.calculateTotal();
            cartTotal.textContent = total;
        }
    }

    calculateTotal() {
        // Simple total calculation - in production you'd parse prices properly
        if (this.items.length === 0) return '$0.00';
        return `${this.items.length} item${this.items.length > 1 ? 's' : ''}`;
    }

    toggleCart() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (cartDropdown) {
            this.isOpen = !this.isOpen;
            cartDropdown.classList.toggle('open', this.isOpen);
        }
    }

    closeCart() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (cartDropdown) {
            this.isOpen = false;
            cartDropdown.classList.remove('open');
        }
    }

    showAddedToCartAnimation() {
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.style.animation = 'cartBounce 0.6s ease-out';
            setTimeout(() => {
                cartToggle.style.animation = '';
            }, 600);
        }
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show checkout modal with Discord redirect
        this.showCheckoutModal();
    }

    showCheckoutModal() {
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
            max-width: 500px;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem; color: #ffa502;">
                <i class="fas fa-credit-card"></i>
            </div>
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.5rem;">
                Complete Your Purchase
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                We don't process payments directly on the website. To complete your purchase, 
                please join our Discord server where our team will assist you with payment 
                and provide your licenses instantly!
            </p>
            <div style="background: var(--background-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Your Cart Summary:</h4>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                    ${this.items.map(item => `• ${item.name} (${item.duration}) - ${item.price}`).join('<br>')}
                </div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="proceed-discord" style="
                    background: linear-gradient(135deg, #5865F2, #4752C4);
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 12px rgba(88, 101, 242, 0.3);
                ">
                    <i class="fab fa-discord"></i>
                    Pay Now on Discord
                </button>
                <button id="close-checkout-modal" style="
                    background: transparent;
                    color: var(--text-secondary);
                    border: 2px solid var(--border-color);
                    padding: 0.75rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">
                    Continue Shopping
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        });

        // Event listeners
        const proceedBtn = modal.querySelector('#proceed-discord');
        const closeBtn = modal.querySelector('#close-checkout-modal');

        proceedBtn.addEventListener('click', () => {
            this.proceedToDiscord();
            closeModal();
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    }

    async proceedToDiscord() {
        try {
            // Send cart data to backend for Discord bot processing
            const response = await fetch('https://bytebunny-backend.onrender.com/api/discord/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: this.items,
                    user: {
                        // In production, get actual user data
                        username: 'Website User',
                        timestamp: new Date().toISOString()
                    }
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Open Discord
                window.open(data.discordInvite || 'https://discord.gg/mcNjvmvkWD', '_blank');
                
                // Clear cart after successful submission
                this.clearCart();
                this.closeCart();
            } else {
                throw new Error('Failed to process checkout');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            // Fallback - just open Discord
            window.open('https://discord.gg/mcNjvmvkWD', '_blank');
        }
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }
}

// Add cart bounce animation
const cartAnimationStyles = `
    @keyframes cartBounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0) scale(1);
        }
        40% {
            transform: translateY(-10px) scale(1.1);
        }
        80% {
            transform: translateY(-5px) scale(1.05);
        }
    }
`;

const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = cartAnimationStyles;
document.head.appendChild(animationStyleSheet);

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.shoppingCart = new ShoppingCart();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}
