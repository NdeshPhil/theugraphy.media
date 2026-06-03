/**
 * THEUGRAPHY MEDIA - Main JavaScript
 * Features: Mobile menu, smooth scrolling, active nav, video modal, form handler, scroll effects
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

        // Close mobile menu when clicking a link
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
                // Update URL without jumping
                history.pushState(null, null, targetId);
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

    window.addEventListener('scroll', highlightActiveNav);
    highlightActiveNav(); // Run once on load

    // ============================================
    // HEADER SCROLL EFFECT (shrink on scroll)
    // ============================================
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ============================================
    // FADE-UP ANIMATION ON SCROLL
    // ============================================
    const fadeElements = document.querySelectorAll('.fade-up');

    function checkFadeUp() {
        fadeElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkFadeUp);
    checkFadeUp();

    // ============================================
    // VIDEO MODAL FUNCTIONALITY (YouTube)
    // ============================================
    const videoTrigger = document.getElementById('videoTrigger');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const youtubeVideo = document.getElementById('youtubeVideo');
    
    let videoSrc = '';
    if (youtubeVideo) {
        videoSrc = youtubeVideo.src;
    }

    if (videoTrigger && videoModal) {
        videoTrigger.addEventListener('click', function() {
            videoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            if (youtubeVideo) {
                youtubeVideo.src = videoSrc + "&autoplay=1";
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            videoModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            if (youtubeVideo) {
                youtubeVideo.src = videoSrc;
            }
        });
    }

    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                videoModal.style.display = 'none';
                document.body.style.overflow = '';
                if (youtubeVideo) {
                    youtubeVideo.src = videoSrc;
                }
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
            videoModal.style.display = 'none';
            document.body.style.overflow = '';
            if (youtubeVideo) {
                youtubeVideo.src = videoSrc;
            }
        }
    });

    // ============================================
    // FORM SUBMISSION HANDLER (with validation)
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
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
            showFormMessage('Thank you! We will get back to you shortly.', 'success');
            contactForm.reset();
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
        msgDiv.className = 'form-message ' + type;
        msgDiv.textContent = message;
        
        const formContainer = document.querySelector('.contact-form');
        if (formContainer) {
            formContainer.appendChild(msgDiv);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            if (msgDiv) msgDiv.remove();
        }, 5000);
    }

    // ============================================
    // LAZY LOAD PREPARATION FOR IMAGES
    // ============================================
    const allImages = document.querySelectorAll('img');
    
    allImages.forEach(function(img) {
        // Skip logos if you want them to load immediately
        if (!img.src.includes('logo')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    // ============================================
    // ADD CSS CLASS FOR FADE-IN EFFECT
    // Add these styles to your CSS if you want the scroll reveal effect:
    // 
    // .fade-up {
    //     opacity: 0;
    //     transform: translateY(30px);
    //     transition: opacity 0.6s ease, transform 0.6s ease;
    // }
    // 
    // .fade-up.visible {
    //     opacity: 1;
    //     transform: translateY(0);
    // }
    // ============================================

    console.log('THEUGRAPHY MEDIA website loaded successfully');
})();
