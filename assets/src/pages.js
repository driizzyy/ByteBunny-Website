// Enhanced JavaScript for ByteBunny legal pages
class PageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupTableOfContents();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupAnimationObserver();
        this.setupScrollToTop();
        this.setupProgressBar();
        this.setupKeyboardNavigation();
        this.setupPrintFriendly();
        this.setupSearchHighlight();
        this.setupExpandableCards();
        this.initializeAnimations();
    }

    // Table of Contents Auto-Generation
    setupTableOfContents() {
        const tocContainer = document.querySelector('.toc-nav');
        if (!tocContainer) return;

        const headings = document.querySelectorAll('h2[id], h3[id], h4[id]');
        if (headings.length === 0) return;

        // Clear existing TOC
        tocContainer.innerHTML = '';

        headings.forEach((heading, index) => {
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.className = 'toc-link';
            link.textContent = heading.textContent;
            link.style.paddingLeft = this.getIndentLevel(heading.tagName) + 'rem';
            
            // Add smooth scroll behavior
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(heading.id);
            });

            tocContainer.appendChild(link);
        });
    }

    getIndentLevel(tagName) {
        switch (tagName) {
            case 'H2': return 1;
            case 'H3': return 1.5;
            case 'H4': return 2;
            default: return 1;
        }
    }

    // Enhanced Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').slice(1);
                this.scrollToSection(targetId);
            });
        });
    }

    scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const offset = 100; // Account for fixed header
        const targetPosition = targetElement.offsetTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Add highlight effect
        this.highlightSection(targetElement);
    }

    highlightSection(element) {
        element.style.transition = 'all 0.5s ease';
        element.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        element.style.borderRadius = '8px';
        element.style.padding = '1rem';

        setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.padding = '';
        }, 2000);
    }

    // Active Navigation Highlighting
    setupActiveNavigation() {
        const tocLinks = document.querySelectorAll('.toc-link');
        const sections = document.querySelectorAll('h2[id], h3[id], h4[id]');

        if (tocLinks.length === 0 || sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.updateActiveNavLink(id, tocLinks);
                }
            });
        }, {
            rootMargin: '-100px 0px -66%',
            threshold: 0.1
        });

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNavLink(activeId, tocLinks) {
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // Animation Observer for Scroll Animations
    setupAnimationObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(`
            .terms-section, .privacy-section, .license-section,
            .usage-item, .security-item, .right-item,
            .permission-item, .limitation-item, .tier-card,
            .condition-item, .termination-item, .contact-method
        `);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // Scroll to Top Button
    setupScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        
        // Add CSS styles
        Object.assign(scrollButton.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        });

        document.body.appendChild(scrollButton);
    }

    // Reading Progress Bar
    setupProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        
        Object.assign(progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            background: 'var(--gradient-primary)',
            zIndex: '1001',
            transition: 'width 0.3s ease'
        });

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });

        document.body.appendChild(progressBar);
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        let currentSectionIndex = 0;
        const sections = document.querySelectorAll('h2[id]');

        document.addEventListener('keydown', (e) => {
            // Only activate when not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'j': // Next section
                case 'ArrowDown':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
                        this.scrollToSection(sections[currentSectionIndex].id);
                    }
                    break;
                case 'k': // Previous section
                case 'ArrowUp':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
                        this.scrollToSection(sections[currentSectionIndex].id);
                    }
                    break;
                case 'Home':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        currentSectionIndex = 0;
                    }
                    break;
                case 'End':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        currentSectionIndex = sections.length - 1;
                    }
                    break;
            }
        });
    }

    // Print-Friendly Styles
    setupPrintFriendly() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .table-of-contents,
                .scroll-to-top,
                .reading-progress,
                .page-header,
                nav {
                    display: none !important;
                }
                
                .content-wrapper {
                    grid-template-columns: 1fr !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .terms-content,
                .privacy-content,
                .license-content {
                    box-shadow: none !important;
                    border: none !important;
                    padding: 1rem !important;
                }
                
                * {
                    animation: none !important;
                    transition: none !important;
                }
                
                .terms-section,
                .privacy-section,
                .license-section {
                    page-break-inside: avoid;
                    margin-bottom: 2rem;
                }
                
                h2 {
                    page-break-after: avoid;
                }
            }
        `;
        document.head.appendChild(printStyles);
    }

    // Search and Highlight Functionality
    setupSearchHighlight() {
        // Add search functionality if URL has search params
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        
        if (searchTerm) {
            this.highlightSearchTerms(searchTerm);
        }
    }

    highlightSearchTerms(term) {
        const walker = document.createTreeWalker(
            document.querySelector('.terms-content, .privacy-content, .license-content'),
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        const regex = new RegExp(`(${term})`, 'gi');
        textNodes.forEach(textNode => {
            if (regex.test(textNode.textContent)) {
                const highlightedHTML = textNode.textContent.replace(regex, '<mark style="background: #fbbf24; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                const span = document.createElement('span');
                span.innerHTML = highlightedHTML;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    }

    // Expandable Cards for Better UX
    setupExpandableCards() {
        const cardContainers = document.querySelectorAll('.usage-grid, .security-measures, .rights-grid, .permissions-grid, .limitations-grid');
        
        cardContainers.forEach(container => {
            const cards = container.querySelectorAll('.usage-item, .security-item, .right-item, .permission-item, .limitation-item');
            
            if (cards.length > 6) {
                // Hide cards beyond the first 6
                cards.forEach((card, index) => {
                    if (index >= 6) {
                        card.style.display = 'none';
                        card.classList.add('hidden-card');
                    }
                });

                // Add expand button
                const expandButton = document.createElement('button');
                expandButton.textContent = `Show ${cards.length - 6} More`;
                expandButton.className = 'expand-button';
                expandButton.style.cssText = `
                    grid-column: 1 / -1;
                    padding: 1rem 2rem;
                    background: var(--gradient-primary);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-top: 1rem;
                `;

                expandButton.addEventListener('click', () => {
                    const hiddenCards = container.querySelectorAll('.hidden-card');
                    const isExpanded = expandButton.textContent.includes('Less');
                    
                    if (isExpanded) {
                        hiddenCards.forEach(card => {
                            card.style.display = 'none';
                        });
                        expandButton.textContent = `Show ${hiddenCards.length} More`;
                    } else {
                        hiddenCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.display = 'block';
                                card.style.animation = 'fadeInScale 0.4s ease-out';
                            }, index * 100);
                        });
                        expandButton.textContent = 'Show Less';
                    }
                });

                container.appendChild(expandButton);
            }
        });
    }

    // Initialize Dynamic Animations
    initializeAnimations() {
        // Stagger animations for grid items
        this.staggerAnimations('.usage-grid > *', 0.1);
        this.staggerAnimations('.security-measures > *', 0.1);
        this.staggerAnimations('.rights-grid > *', 0.1);
        this.staggerAnimations('.permissions-grid > *', 0.1);
        this.staggerAnimations('.limitations-grid > *', 0.1);
        this.staggerAnimations('.license-tiers > *', 0.2);
        this.staggerAnimations('.conditions-list > *', 0.15);
        this.staggerAnimations('.contact-info > *', 0.1);

        // Add hover effects to interactive elements
        this.addHoverEffects();
        
        // Initialize typewriter effect for page title
        this.typewriterEffect();
    }

    staggerAnimations(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}s`;
        });
    }

    addHoverEffects() {
        const hoverElements = document.querySelectorAll(`
            .usage-item, .security-item, .right-item,
            .permission-item, .limitation-item, .tier-card,
            .condition-item, .contact-method
        `);

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-8px) scale(1.02)';
                el.style.zIndex = '10';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.zIndex = '';
            });
        });
    }

    typewriterEffect() {
        const title = document.querySelector('.page-title');
        if (!title) return;

        const text = title.textContent;
        const icon = title.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';
        
        title.innerHTML = iconHTML;
        
        let index = 0;
        const typewriter = () => {
            if (index < text.length) {
                title.innerHTML = iconHTML + text.slice(0, index + 1);
                index++;
                setTimeout(typewriter, 50);
            }
        };

        // Start typewriter effect after page load
        setTimeout(typewriter, 1000);
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Copy to Clipboard Functionality
    addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre, code');
        codeBlocks.forEach(block => {
            if (block.textContent.trim().length > 20) {
                const copyButton = document.createElement('button');
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.className = 'copy-button';
                copyButton.style.cssText = `
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    padding: 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;

                block.style.position = 'relative';
                block.addEventListener('mouseenter', () => {
                    copyButton.style.opacity = '1';
                });
                block.addEventListener('mouseleave', () => {
                    copyButton.style.opacity = '0';
                });

                copyButton.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(block.textContent);
                        copyButton.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                });

                block.appendChild(copyButton);
            }
        });
    }
}

// Initialize page manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const pageManager = new PageManager();
    
    // Add keyboard shortcuts help
    const helpOverlay = document.createElement('div');
    helpOverlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.8rem;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    `;
    
    helpOverlay.innerHTML = `
        <strong>Keyboard Shortcuts:</strong><br>
        Ctrl + ↓/j - Next section<br>
        Ctrl + ↑/k - Previous section<br>
        Ctrl + Home - Go to top<br>
        Ctrl + End - Go to bottom
    `;
    
    document.body.appendChild(helpOverlay);
    
    // Show help on first visit
    if (!localStorage.getItem('bytebunny-help-shown')) {
        setTimeout(() => {
            helpOverlay.style.opacity = '1';
            setTimeout(() => {
                helpOverlay.style.opacity = '0';
            }, 5000);
        }, 2000);
        localStorage.setItem('bytebunny-help-shown', 'true');
    }
    
    // Show help on ? key press
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.ctrlKey && !e.altKey) {
            helpOverlay.style.opacity = helpOverlay.style.opacity === '1' ? '0' : '1';
        }
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageManager;
}
