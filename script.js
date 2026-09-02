// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.getElementById('theme-toggle');
const particlesContainer = document.getElementById('particles');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const isDark = document.body.classList.contains('dark-theme');
    if (window.scrollY > 50) {
        navbar.style.background = isDark ? 'rgba(15, 15, 35, 0.98)' : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = isDark ? '0 2px 20px rgba(0, 0, 0, 0.3)' : '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.borderBottom = isDark ? '1px solid var(--border-color-dark)' : '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottom = isDark ? '1px solid var(--border-color-dark)' : '1px solid rgba(0, 0, 0, 0.1)';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-header, .about-grid, .about-card, .about-visual, .skills-grid, .projects-grid, .contact-content');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Add slide animations to specific elements
    const aboutText = document.querySelector('.about-card');
    const aboutImage = document.querySelector('.about-visual');
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form');
    
    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        observer.observe(aboutText);
    }
    
    if (aboutImage) {
        aboutImage.classList.add('slide-in-right');
        observer.observe(aboutImage);
    }
    
    if (contactInfo) {
        contactInfo.classList.add('slide-in-left');
        observer.observe(contactInfo);
    }
    
    if (contactForm) {
        contactForm.classList.add('slide-in-right');
        observer.observe(contactForm);
    }
});

// Initialize EmailJS
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('l6zy5u5PF_XvhkhSc');
})();

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's exactly 10 digits
    return cleanPhone.length === 10;
}

function validateForm(formData) {
    const errors = [];
    
    // Name validation
    const name = formData.get('name').trim();
    if (name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation
    const email = formData.get('email').trim();
    if (!validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    const phone = formData.get('phone').trim();
    if (!validatePhone(phone)) {
        errors.push('Please enter a valid mobile number (exactly 10 digits)');
    }
    
    // Subject validation
    const subject = formData.get('subject').trim();
    if (subject.length < 3) {
        errors.push('Subject must be at least 3 characters long');
    }
    
    // Message validation
    const message = formData.get('message').trim();
    if (message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Contact form handling with EmailJS
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Validate form
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            showNotification(validationErrors.join('. '), 'error');
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        const templateParams = {
            from_name: formData.get('name').trim(),
            from_email: formData.get('email').trim(),
            from_phone: formData.get('phone').trim(),
            subject: formData.get('subject').trim(),
            message: formData.get('message').trim(),
            to_email: 'shashankshetty51201@gmail.com' // Your email
        };
        
        try {
            // Send email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
            const response = await emailjs.send(
                'service_pk7tuld',
                'template_srbhnyi',
                templateParams
            );
            
            if (response.status === 200) {
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            // Show error message
            showNotification('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation feedback
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            // Clear error styling on input
            input.style.borderColor = '';
            const errorMsg = input.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    // Special handling for phone number field
    const phoneInput = contactForm.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            e.target.value = value;
            
            // Clear error styling
            e.target.style.borderColor = '';
            const errorMsg = e.target.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
        
        // Prevent pasting non-digit characters
        phoneInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digitsOnly = paste.replace(/\D/g, '').substring(0, 10);
            e.target.value = digitsOnly;
        });
        
        // Prevent typing non-digit characters
        phoneInput.addEventListener('keypress', (e) => {
            // Allow: backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.type) {
        case 'text':
            if (field.name === 'name') {
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
            } else if (field.name === 'subject') {
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 3 characters long';
                }
            }
            break;
            
        case 'email':
            if (!validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'tel':
            if (!validatePhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid mobile number (exactly 10 digits)';
            }
            break;
            
        case 'textarea':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    // Show/hide error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (!isValid) {
        field.style.borderColor = '#ef4444';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    } else {
        field.style.borderColor = '#10b981';
    }
    
    return isValid;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing animation disabled to preserve golden color
// The typing animation was causing the golden color to disappear after page load

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.image-container');
    
    if (hero && heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Skill items hover effect
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Project cards 3D tilt effect
document.addEventListener('DOMContentLoaded', () => {
    // Existing generic cards (if any)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // Custom projects layout cards
    const customProjectItems = document.querySelectorAll('.custom-projects .project-item');
    customProjectItems.forEach(card => {
        const maxTilt = 10; // degrees

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 80ms ease, box-shadow 120ms ease';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Tilt toward pointer
            const percentX = (x - centerX) / centerX; // -1 to 1
            const percentY = (y - centerY) / centerY; // -1 to 1

            const rotateY = -percentX * maxTilt; // rightwards tilt when pointer on right
            const rotateX = percentY * maxTilt;  // downward tilt when pointer is lower

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 200ms ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });

        // When hovering the CTA arrow, bias the bend to the right a bit
        const cta = card.querySelector('.know-more');
        if (cta) {
            cta.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 180ms ease';
                card.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(-6deg)';
            });
            cta.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 200ms ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        }
    });
});

// Smooth reveal animation for stats
// Animated counters on page load
function animateStatsOnce() {
    const metrics = document.querySelectorAll('.metric .metric-value');
    metrics.forEach(metric => {
        const target = parseFloat(metric.getAttribute('data-target')) || 0;
        const suffix = metric.getAttribute('data-suffix') || '';
        const durationMs = 3600; // slower animation
        const decimals = Number.isInteger(target) ? 0 : 1;
        const startTime = performance.now();
        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // easeOutCubic for smoother slow finish
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = (eased * target).toFixed(decimals);
            metric.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// Trigger stats animation when about section is visible
document.addEventListener('DOMContentLoaded', () => {
    animateStatsOnce();
});

// Add CSS for notification styles
const notificationStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Add active class to navigation links
const navLinkStyles = `
    .nav-link.active {
        color: #6366f1;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    body.dark-theme .nav-link.active {
        color: var(--accent-primary-dark);
    }
`;

const navStyleSheet = document.createElement('style');
navStyleSheet.textContent = navLinkStyles;
document.head.appendChild(navStyleSheet);

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[src*="placeholder"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Add scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
    scrollToTopBtn.style.background = '#4f46e5';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
    scrollToTopBtn.style.background = '#6366f1';
});

// Project Tabs removed for custom projects layout

// Enhanced project card animations with stagger effect
function animateProjectCards() {
    const visibleCards = document.querySelectorAll('.project-card:not(.hidden)');
    
    visibleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        
        setTimeout(() => {
            card.classList.remove('fade-in');
        }, 600 + (index * 100));
    });
}

// Add intersection observer for project section animations
const projectsSection = document.querySelector('.projects');
if (projectsSection) {
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger initial animation when section comes into view
                setTimeout(() => {
                    animateProjectCards();
                }, 200);
                projectsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    projectsObserver.observe(projectsSection);
}

// Add keyboard navigation for tabs
document.addEventListener('keydown', (e) => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const activeTab = document.querySelector('.tab-btn.active');
    const activeIndex = Array.from(tabButtons).indexOf(activeTab);
    
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
        tabButtons[activeIndex - 1].click();
    } else if (e.key === 'ArrowRight' && activeIndex < tabButtons.length - 1) {
        tabButtons[activeIndex + 1].click();
    }
});

// Add tab counter functionality
function updateTabCounts() {
    const categories = ['all', 'wordpress', 'fullstack', 'frontend'];
    const projectCards = document.querySelectorAll('.project-card');
    
    categories.forEach(category => {
        const tabButton = document.querySelector(`[data-tab="${category}"]`);
        if (tabButton) {
            let count = 0;
            
            if (category === 'all') {
                count = projectCards.length;
            } else {
                // Count cards that include this category
                projectCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-category').split(' ');
                    if (cardCategories.includes(category)) {
                        count++;
                    }
                });
            }
            
            // Add count badge to tab button
            let countBadge = tabButton.querySelector('.tab-count');
            if (!countBadge) {
                countBadge = document.createElement('span');
                countBadge.className = 'tab-count';
                tabButton.appendChild(countBadge);
            }
            countBadge.textContent = count;
        }
    });
}

// Initialize tab counts when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateTabCounts();
});

// Add CSS for tab count badges
const tabCountStyles = `
    .tab-count {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 8px;
        font-weight: 500;
    }
    
    .tab-btn:not(.active) .tab-count {
        background: #e5e7eb;
        color: #6b7280;
    }
`;

const tabCountStyleSheet = document.createElement('style');
tabCountStyleSheet.textContent = tabCountStyles;
document.head.appendChild(tabCountStyleSheet);

// Theme Toggle Functionality
function initThemeToggle() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
        
        // Add ripple effect
        createRippleEffect(themeToggle);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

// Particle System
function createParticleSystem() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    // Random animation duration
    const duration = Math.random() * 4 + 6;
    particle.style.animationDuration = duration + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(); // Create new particle
        }
    }, duration * 1000);
}

// Ripple Effect
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2 - size / 2;
    const y = rect.height / 2 - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Enhanced Scroll Effects
function initEnhancedScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        // Parallax effect for hero image
        const heroImage = document.querySelector('.image-container');
        if (heroImage) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
        
        // Morphing background elements
        const morphingElements = document.querySelectorAll('.morphing-bg');
        morphingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Enhanced Mouse Effects
function initMouseEffects() {
    // Custom cursor functionality removed
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    createParticleSystem();
    initEnhancedScrollEffects();
    initMouseEffects();
    
    // Add shimmer effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('shimmer');
    });
    
    // Add wave animation to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        title.classList.add('wave-animation');
        title.style.animationDelay = (index * 0.5) + 's';
    });
});

// Update current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});


console.log('Portfolio website with dark theme and enhanced animations loaded successfully! 🚀✨');
