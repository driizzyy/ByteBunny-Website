// Configuration Manager for ByteBunny Website
class ConfigManager {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    // Load configuration from JSON file
    async loadConfig() {
        try {
            const response = await fetch('assets/config/links.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.config = await response.json();
            this.loaded = true;
            console.log('Configuration loaded successfully');
            return this.config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Fallback to default values
            this.config = this.getDefaultConfig();
            this.loaded = true;
            return this.config;
        }
    }

    // Get default configuration if loading fails
    getDefaultConfig() {
        return {
            discord: {
                server: {
                    main: "https://discord.gg/mcNjvmvkWD",
                    invite: "https://discord.gg/mcNjvmvkWD"
                },
                channels: {
                    alpha_program: "https://discord.gg/mcNjvmvkWD",
                    beta_program: "https://discord.gg/mcNjvmvkWD",
                    trial_keys: "https://discord.gg/mcNjvmvkWD",
                    hwid_reset: "https://discord.gg/mcNjvmvkWD",
                    boost_license: "https://discord.gg/mcNjvmvkWD",
                    script_submission: "https://discord.gg/mcNjvmvkWD",
                    roadmap_tool: "https://discord.gg/mcNjvmvkWD",
                    general_support: "https://discord.gg/mcNjvmvkWD",
                    announcements: "https://discord.gg/mcNjvmvkWD"
                }
            },
            github: {
                driizzyy: "https://github.com/driizzyy",
                devil: "https://github.com/Devil-c137",
                main_repo: "https://github.com/driizzyy/bytebunny-selfbot"
            },
            website: {
                terms_of_service: "#",
                privacy_policy: "#",
                license: "#"
            }
        };
    }

    // Get Discord channel link
    getDiscordLink(type) {
        if (!this.loaded || !this.config) {
            console.warn('Configuration not loaded, using default Discord link');
            return "https://discord.gg/mcNjvmvkWD";
        }

        // Check if it's a channel link
        if (this.config.discord.channels[type]) {
            return this.config.discord.channels[type];
        }

        // Check if it's a server link
        if (this.config.discord.server[type]) {
            return this.config.discord.server[type];
        }

        // Default to main server invite
        return this.config.discord.server.main;
    }

    // Get GitHub link
    getGitHubLink(type) {
        if (!this.loaded || !this.config) {
            return "#";
        }
        return this.config.github[type] || "#";
    }

    // Get website link
    getWebsiteLink(type) {
        if (!this.loaded || !this.config) {
            return "#";
        }
        return this.config.website[type] || "#";
    }

    // Update all links on the page
    updatePageLinks() {
        if (!this.loaded) {
            console.warn('Configuration not loaded, cannot update links');
            return;
        }

        // Update Discord links
        this.updateDiscordLinks();
        
        // Update GitHub links
        this.updateGitHubLinks();
        
        // Update website links
        this.updateWebsiteLinks();
    }

    // Update Discord-related links
    updateDiscordLinks() {
        const linkMappings = {
            // Main Discord buttons
            '[href*="discord.gg/mcNjvmvkWD"]': 'main',
            
            // Program-specific links
            '.btn-alpha': 'alpha_program',
            '.btn-beta': 'beta_program', 
            '.btn-trial': 'trial_keys',
            '.btn-outline[href*="discord"]': 'hwid_reset',
            '.btn-community': 'script_submission',
            '.btn-roadmap': 'roadmap_tool'
        };

        Object.entries(linkMappings).forEach(([selector, linkType]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const newLink = this.getDiscordLink(linkType);
                if (element.tagName === 'A') {
                    element.href = newLink;
                }
            });
        });
    }

    // Update GitHub links
    updateGitHubLinks() {
        // Update DriizzyyB GitHub links
        const driizzyyLinks = document.querySelectorAll('a[href*="github.com/driizzyy"]');
        driizzyyLinks.forEach(link => {
            link.href = this.getGitHubLink('driizzyy');
        });

        // Update Mr. Devil GitHub links
        const devilLinks = document.querySelectorAll('a[href*="github.com/Devil-c137"]');
        devilLinks.forEach(link => {
            link.href = this.getGitHubLink('devil');
        });
    }

    // Update website links
    updateWebsiteLinks() {
        const websiteLinkMappings = {
            'a[href="#"]': {
                'Terms of Service': 'terms_of_service',
                'Privacy Policy': 'privacy_policy', 
                'License': 'license'
            }
        };

        Object.entries(websiteLinkMappings).forEach(([selector, mappings]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent.trim();
                if (mappings[text]) {
                    element.href = this.getWebsiteLink(mappings[text]);
                }
            });
        });
    }

    // Add click tracking for analytics
    addClickTracking() {
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a');
            if (target && target.href.includes('discord.com')) {
                console.log(`Discord link clicked: ${target.href}`);
                // You can add analytics tracking here
            }
        });
    }
}

// Export for use in other scripts
window.ConfigManager = ConfigManager;
