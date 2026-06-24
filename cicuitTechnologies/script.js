// Main website functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('footer a[data-page]');
    const serviceLinks = document.querySelectorAll('.service-link, .breadcrumb a[data-page]');
    const ctaButtons = document.querySelectorAll('.cta-box .btn, .btn[data-page]');
    const allLinks = [...navLinks, ...footerLinks, ...serviceLinks, ...ctaButtons];
    const pages = document.querySelectorAll('.page');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.getElementById('contactForm');

    // Page Titles
    const pageTitles = {
        'home': 'Circuit Technologies Uganda Limited - Where Technology Meets Innovation',
        'about': 'About Us - Circuit Technologies Uganda Limited',
        'services': 'Our Services - Circuit Technologies Uganda Limited',
        'products': 'Our Products - Circuit Technologies Uganda Limited',
        'contact': 'Contact Us - Circuit Technologies Uganda Limited',
        'it-infrastructure': 'IT Infrastructure Solutions - Circuit Technologies',
        'data-collection': 'Data Collection & Analytics - Circuit Technologies',
        'networking': 'Networking Solutions - Circuit Technologies',
        'software-development': 'Software Development - Circuit Technologies',
        'it-consulting': 'IT Consulting Services - Circuit Technologies',
        'electrical-installation': 'Electrical Installation Services - Circuit Technologies'
    };

    // Utility Functions
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Create notification content
        const notificationContent = document.createElement('div');
        notificationContent.className = 'notification-content';
        
        // Create icon based on type
        let icon = '✓';
        if (type === 'error') icon = '✗';
        if (type === 'warning') icon = '⚠';
        
        notificationContent.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.appendChild(notificationContent);

        // Add to document
        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    function updateDocumentTitle(pageId) {
        document.title = pageTitles[pageId] || pageTitles['home'];
    }

    function switchPage(targetPage) {
        // Update active page
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetPage) {
                page.classList.add('active');
            }
        });

        // Update active nav link
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('data-page') === targetPage) {
                navLink.classList.add('active');
            }
        });

        // Update document title
        updateDocumentTitle(targetPage);

        // Close mobile menu if open
        navMenu.classList.remove('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const consent = document.getElementById('consent');

        // Validation
        if (!name || !email || !message || !consent?.checked) {
            showNotification('Please fill in all required fields and agree to the terms.', 'error');
            resetButtonState(btnText, btnLoader, submitBtn);
            return;
        }

        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            resetButtonState(btnText, btnLoader, submitBtn);
            return;
        }

        // Prepare form data
        const formData = new FormData(contactForm);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', 'Circuit Technologies Website');

        // Send request
        sendContactForm(formData, btnText, btnLoader, submitBtn);
    }

    function resetButtonState(btnText, btnLoader, submitBtn) {
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }

    async function sendContactForm(formData, btnText, btnLoader, submitBtn) {
        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.text();
            
            if (response.ok) {
                if (data.includes('Thank you') || data.includes('success')) {
                    showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('Message sent, but there was an issue with the response.', 'warning');
                }
            } else {
                showNotification('Server error. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            showNotification('Network error. Please check your connection and try again.', 'error');
        } finally {
            resetButtonState(btnText, btnLoader, submitBtn);
        }
    }

    function handleImageError() {
        const placeholderColor = '#2a6bc5';
        const altText = this.alt || 'Image';
        
        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect width="100%" height="100%" fill="${placeholderColor}"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" 
                      font-family="Arial, sans-serif" font-size="14">
                    ${altText}
                </text>
            </svg>
        `;
        
        this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    }

    function setupImageErrorHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', handleImageError);
        });
    }

    function setupMobileMenu() {
        // Mobile menu toggle
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    function setupNavigation() {
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                if (targetPage) {
                    switchPage(targetPage);
                }
            });
        });
    }

    function setupFormValidation() {
        if (!contactForm) return;

        // Real-time validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && !validateEmail(this.value)) {
                    this.style.borderColor = '#f44336';
                    this.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.1)';
                } else {
                    this.style.borderColor = '#ddd';
                    this.style.boxShadow = 'none';
                }
            });
        }

        // Form submission
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    function injectNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Notification Styles */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                overflow: hidden;
                min-width: 320px;
                max-width: 400px;
                animation: slideInRight 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 16px 20px;
                position: relative;
            }
            
            .notification-icon {
                font-size: 20px;
                margin-right: 15px;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                flex-shrink: 0;
            }
            
            .notification-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
                color: #333;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                font-size: 24px;
                cursor: pointer;
                margin-left: 10px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #666;
            }
            
            /* Notification Types */
            .notification-success {
                border-left: 4px solid #4CAF50;
            }
            
            .notification-success .notification-icon {
                background: rgba(76, 175, 80, 0.1);
                color: #4CAF50;
            }
            
            .notification-error {
                border-left: 4px solid #f44336;
            }
            
            .notification-error .notification-icon {
                background: rgba(244, 67, 54, 0.1);
                color: #f44336;
            }
            
            .notification-warning {
                border-left: 4px solid #ff9800;
            }
            
            .notification-warning .notification-icon {
                background: rgba(255, 152, 0, 0.1);
                color: #ff9800;
            }
            
            /* Animations */
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
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Service and product card animations */
            .service-card, .product-card {
                animation: fadeIn 0.5s ease;
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                    min-width: auto;
                }
            }
            
            @media (max-width: 480px) {
                .notification {
                    top: 10px;
                    left: 10px;
                    right: 10px;
                }
                
                .notification-content {
                    padding: 12px 16px;
                }
                
                .notification-icon {
                    font-size: 18px;
                    width: 26px;
                    height: 26px;
                    margin-right: 12px;
                }
                
                .notification-message {
                    font-size: 13px;
                }
                
                .notification-close {
                    font-size: 20px;
                    width: 20px;
                    height: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function addNotificationClickOutside() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.notification')) {
                return;
            }
            
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        });
    }

    // Initialize everything
    function init() {
        setupNavigation();
        setupMobileMenu();
        setupFormValidation();
        setupImageErrorHandling();
        injectNotificationStyles();
        addNotificationClickOutside();
        switchPage('home');
    }

    // Start the application
    init();
});