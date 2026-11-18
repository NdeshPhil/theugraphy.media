(function() {
    'use strict';

    // ============================================
    // MOBILE MENU
    // ============================================
    var menuToggle = document.getElementById('mobile-menu');
    var navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            var icon = menuToggle.querySelector('i');
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

        var links = navLinks.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                var icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ============================================
    // HERO SLIDESHOW
    // ============================================
    (function() {
        var slides = document.querySelectorAll('.hero-slideshow .slide');
        var indicatorsContainer = document.getElementById('heroIndicators');
        if (!slides.length || !indicatorsContainer) return;

        var current = 0;
        var interval = 5000;
        var timer = null;

        slides.forEach(function(_, i) {
            var btn = document.createElement('button');
            btn.className = 'indicator' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            btn.addEventListener('click', function() {
                goTo(i);
                restartTimer();
            });
            indicatorsContainer.appendChild(btn);
        });

        var indicators = indicatorsContainer.querySelectorAll('.indicator');

        function goTo(index) {
            slides[current].classList.remove('active');
            indicators[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            indicators[current].classList.add('active');
        }

        function next() { goTo(current + 1); }
        function startTimer() { timer = setInterval(next, interval); }
        function restartTimer() { clearInterval(timer); startTimer(); }

        startTimer();
    })();

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, targetId);
            }
        });
    });

    // ============================================
    // ACTIVE NAV HIGHLIGHT
    // ============================================
    var sections = document.querySelectorAll('section[id]');
    var navItems = document.querySelectorAll('.nav-links a');

    function highlightActiveNav() {
        var scrollPosition = window.scrollY + 150;
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            var sectionBottom = sectionTop + section.offsetHeight;
            var sectionId = section.getAttribute('id');
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
    highlightActiveNav();

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    var header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ============================================
    // FADE-UP
    // ============================================
    var fadeElements = document.querySelectorAll('.fade-up');

    function checkFadeUp() {
        fadeElements.forEach(function(element) {
            var elementTop = element.getBoundingClientRect().top;
            var windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkFadeUp);
    checkFadeUp();

    // ============================================
    // VIDEO MODALS
    // ============================================
    var videoConfigs = [
        { triggerId: 'videoTrigger1', modalId: 'videoModal1', videoId: 'youtubeVideo1' },
        { triggerId: 'videoTrigger2', modalId: 'videoModal2', videoId: 'youtubeVideo2' },
        { triggerId: 'videoTrigger3', modalId: 'videoModal3', videoId: 'youtubeVideo3' },
        { triggerId: 'videoTrigger4', modalId: 'videoModal4', videoId: 'youtubeVideo4' }
    ];

    videoConfigs.forEach(function(config) {
        var trigger = document.getElementById(config.triggerId);
        var modal = document.getElementById(config.modalId);
        var video = document.getElementById(config.videoId);
        var closeBtn = modal ? modal.querySelector('.close-modal') : null;

        if (trigger && modal && video) {
            var videoSrc = video.src;

            trigger.addEventListener('click', function() {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                video.src = videoSrc + '&autoplay=1';
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    video.src = videoSrc;
                });
            }

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    video.src = videoSrc;
                }
            });
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var openModals = document.querySelectorAll('.video-modal[style*="display: flex"]');
            openModals.forEach(function(modal) {
                var video = modal.querySelector('iframe');
                modal.style.display = 'none';
                document.body.style.overflow = '';
                if (video) {
                    var src = video.src.replace('&autoplay=1', '');
                    video.src = src;
                }
            });
        }
    });

    // ============================================
    // LIGHTBOX
    // ============================================
    (function() {
        var lightboxModal = document.getElementById('lightboxModal');
        var lightboxImage = document.getElementById('lightboxImage');
        var lightboxCounter = document.getElementById('lightboxCounter');
        var lightboxThumbnails = document.getElementById('lightboxThumbnails');
        var closeLightbox = document.getElementById('closeLightbox');
        var prevBtn = document.getElementById('lightboxPrev');
        var nextBtn = document.getElementById('lightboxNext');
        var currentIndex = 0;
        var currentGallery = [];

        var galleries = {
            'annual': { count: 12, prefix: 'annual-', ext: '.jpg' },
            'documentary': { count: 12, prefix: 'documentary-', ext: '.jpg' },
            'executive': { count: 3, prefix: 'executive-', ext: '.jpg' }
        };

        Object.keys(galleries).forEach(function(key) {
            var g = galleries[key];
            var arr = [];
            for (var i = 1; i <= g.count; i++) {
                var num = i < 10 ? '0' + i : '' + i;
                arr.push('images/' + g.prefix + num + g.ext);
            }
            g.images = arr;
        });

        function openLightbox(galleryKey) {
            var gallery = galleries[galleryKey];
            if (!gallery) return;
            currentGallery = gallery.images;
            currentIndex = 0;
            renderLightbox();
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function renderLightbox() {
            if (currentGallery.length === 0) return;
            lightboxImage.src = currentGallery[currentIndex];
            lightboxImage.alt = 'Gallery image ' + (currentIndex + 1);
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;

            lightboxThumbnails.innerHTML = '';
            currentGallery.forEach(function(src, i) {
                var thumb = document.createElement('img');
                thumb.src = src;
                thumb.alt = 'Thumbnail ' + (i + 1);
                if (i === currentIndex) {
                    thumb.classList.add('active-thumb');
                }
                thumb.addEventListener('click', function() {
                    currentIndex = i;
                    renderLightbox();
                });
                lightboxThumbnails.appendChild(thumb);
            });
        }

        function nextImage() {
            if (currentGallery.length === 0) return;
            currentIndex = (currentIndex + 1) % currentGallery.length;
            renderLightbox();
        }

        function prevImage() {
            if (currentGallery.length === 0) return;
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            renderLightbox();
        }

        function closeLightboxFn() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        var triggers = document.querySelectorAll('.gallery-trigger');
        triggers.forEach(function(trigger) {
            trigger.addEventListener('click', function() {
                var galleryKey = this.getAttribute('data-gallery');
                openLightbox(galleryKey);
            });
        });

        if (closeLightbox) closeLightbox.addEventListener('click', closeLightboxFn);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        document.addEventListener('keydown', function(e) {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightboxFn();
            else if (e.key === 'ArrowLeft') prevImage();
            else if (e.key === 'ArrowRight') nextImage();
        });

        if (lightboxModal) {
            lightboxModal.addEventListener('click', function(e) {
                if (e.target === lightboxModal) closeLightboxFn();
            });
        }
    })();

    // ============================================
    // CONTACT FORM
    // ============================================
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var nameInput = document.getElementById('name');
            var emailInput = document.getElementById('email');
            var messageInput = document.getElementById('message');

            var isValid = true;
            var errorMessage = '';

            if (!nameInput.value.trim()) {
                isValid = false; errorMessage = 'Please enter your name.';
                nameInput.style.borderColor = '#D4AF37';
            } else { nameInput.style.borderColor = '#3A3A3A'; }

            if (!emailInput.value.trim()) {
                isValid = false; errorMessage = 'Please enter your email address.';
                emailInput.style.borderColor = '#D4AF37';
            } else if (!isValidEmail(emailInput.value.trim())) {
                isValid = false; errorMessage = 'Please enter a valid email address.';
                emailInput.style.borderColor = '#D4AF37';
            } else { emailInput.style.borderColor = '#3A3A3A'; }

            if (!messageInput.value.trim()) {
                isValid = false; errorMessage = 'Please enter your message.';
                messageInput.style.borderColor = '#D4AF37';
            } else { messageInput.style.borderColor = '#3A3A3A'; }

            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }

            showFormMessage('Thank you! We will get back to you shortly.', 'success');
            contactForm.reset();
        });
    }

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        var existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        var msgDiv = document.createElement('div');
        msgDiv.className = 'form-message ' + type;
        msgDiv.textContent = message;

        var formContainer = document.querySelector('.contact-form');
        if (formContainer) formContainer.appendChild(msgDiv);

        setTimeout(function() { if (msgDiv) msgDiv.remove(); }, 5000);
    }

    // ============================================
    // LAZY LOAD
    // ============================================
    var allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
        if (!img.src.includes('logo')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    console.log('THEUGRAPHY MEDIA website loaded successfully');

})();
