/**
 * THEUGRAPHY MEDIA - Main JavaScript
 * Interactions: Mobile menu, smooth scrolling, form placeholder handling, scroll effects
 */

(function() {
    'use strict';

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Toggle between hamburger and close icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function highlightActiveNav() {
        let scrollPosition = window.scrollY + 150; // Offset for sticky header

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItems.forEach(function(item) {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Add active class styling (add to CSS if desired)
    // For now, just add the class - you can style .nav-links a.active in CSS
    window.addEventListener('scroll', highlightActiveNav);
    highlightActiveNav(); // Run once on load

    // ============================================
    // HEADER SCROLL EFFECT (shrink on scroll)
    // ============================================
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.padding = '0';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.padding = '';
            header.style.boxShadow = '';
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // FORM SUBMISSION HANDLER (with basic validation)
    // ============================================
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[placeholder="Your Name"]');
            const emailInput = this.querySelector('input[placeholder="Email Address"]');
            const messageInput = this.querySelector('textarea');
            
            let isValid = true;
            let errorMessage = '';
            
            // Simple validation
            if (!nameInput.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your name.';
                nameInput.style.borderColor = '#D4AF37';
            } else {
                nameInput.style.borderColor = '#3A3A3A';
            }
            
            if (!emailInput.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your email address.';
                emailInput.style.borderColor = '#D4AF37';
            } else if (!isValidEmail(emailInput.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
                emailInput.style.borderColor = '#D4AF37';
            } else {
                emailInput.style.borderColor = '#3A3A3A';
            }
            
            if (!messageInput.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your message.';
                messageInput.style.borderColor = '#D4AF37';
            } else {
                messageInput.style.borderColor = '#3A3A3A';
            }
            
            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }
            
            // If valid, show success message
            // Note: Actual form sending requires backend or service like Formspree
            showFormMessage('Thank you! We will get back to you shortly.', 'success');
            this.reset();
            
            // Remove border colors after reset
            nameInput.style.borderColor = '#3A3A3A';
            emailInput.style.borderColor = '#3A3A3A';
            messageInput.style.borderColor = '#3A3A3A';
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'form-message';
        msgDiv.textContent = message;
        msgDiv.style.marginTop = '16px';
        msgDiv.style.padding = '12px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.fontSize = '0.9rem';
        
        if (type === 'success') {
            msgDiv.style.backgroundColor = '#D4AF37';
            msgDiv.style.color = '#1A1A1A';
        } else {
            msgDiv.style.backgroundColor = '#3A1A1A';
            msgDiv.style.color = '#D4AF37';
            msgDiv.style.border = '1px solid #D4AF37';
        }
        
        const form = document.querySelector('.contact-form form');
        form.appendChild(msgDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            if (msgDiv) msgDiv.remove();
        }, 5000);
    }

    // ============================================
    // LAZY LOAD PLACEHOLDER FOR IMAGES
    // (Prepares for when you add actual images)
    // ============================================
    const imagePlaceholders = document.querySelectorAll('.hero-image, .portfolio-image');
    
    imagePlaceholders.forEach(function(placeholder) {
        // Add a subtle fade-in effect when images are eventually added
        placeholder.style.transition = 'opacity 0.5s ease';
    });
    
    // Helper function to replace placeholder with actual image
    window.replaceImage = function(element, imageUrl, altText) {
        if (element) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = altText || 'THEUGRAPHY Media visual';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = 'inherit';
            element.innerHTML = '';
            element.appendChild(img);
        }
    };

    // ============================================
    // ADD SCROLL REVEAL EFFECT (optional)
    // ============================================
    const revealElements = document.querySelectorAll('.service-card, .why-item, .step, .portfolio-item, .team-card');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Add CSS class for fade-in effect (add to your CSS if desired)
    // For now, just add the class - you can style .service-card.revealed in CSS
    window.addEventListener('scroll', checkReveal);
    checkReveal();

})();

// ============================================
// ADD THESE STYLES TO YOUR style.css IF YOU WANT THE SCROLL REVEAL EFFECT
// 
// .service-card, .why-item, .step, .portfolio-item, .team-card {
//     opacity: 0;
//     transform: translateY(30px);
//     transition: opacity 0.6s ease, transform 0.6s ease;
// }
// 
// .service-card.revealed, .why-item.revealed, .step.revealed, 
// .portfolio-item.revealed, .team-card.revealed {
//     opacity: 1;
//     transform: translateY(0);
// }
// ============================================
