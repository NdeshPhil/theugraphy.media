(function() {
    'use strict';

    // ============================================
    // MOBILE MENU TOGGLE
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
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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
    // HERO SLIDESHOW
    // ============================================
    (function() {
        var slides = document.querySelectorAll('.slide');
        var dots = document.querySelectorAll('.dot');
        var prevBtn = document.getElementById('prevSlide');
        var nextBtn = document.getElementById('nextSlide');
        var currentIndex = 0;
        var slideInterval;

        function showSlide(index) {
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        function nextSlide() {
            var newIndex = (currentIndex + 1) % slides.length;
            showSlide(newIndex);
        }

        function prevSlide() {
            var newIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(newIndex);
        }

        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetSlideshow() {
            clearInterval(slideInterval);
            startSlideshow();
        }

        if (slides.length > 0) {
            dots.forEach(function(dot) {
                dot.addEventListener('click', function() {
                    var index = parseInt(this.getAttribute('data-index'));
                    showSlide(index);
                    resetSlideshow();
                });
            });

            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    prevSlide();
                    resetSlideshow();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    nextSlide();
                    resetSlideshow();
                });
            }

            startSlideshow();

            var slideshowContainer = document.querySelector('.hero-slideshow');
            if (slideshowContainer) {
                slideshowContainer.addEventListener('mouseenter', function() {
                    clearInterval(slideInterval);
                });
                slideshowContainer.addEventListener('mouseleave', function() {
                    startSlideshow();
                });
            }
        }
    })();

    // ============================================
    // VIDEO MODAL (YouTube)
    // ============================================
    var videoTrigger = document.getElementById('videoTrigger');
    var videoModal = document.getElementById('videoModal');
    var closeModal = document.getElementById('closeModal');
    var youtubeVideo = document.getElementById('youtubeVideo');
    var videoSrc = '';
    if (youtubeVideo) {
        videoSrc = youtubeVideo.src;
    }

    if (videoTrigger && videoModal) {
        videoTrigger.addEventListener('click', function() {
            videoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (youtubeVideo) {
                youtubeVideo.src = videoSrc + '&autoplay=1';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            videoModal.style.display = 'none';
            document.body.style.overflow = '';
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
    // LIGHTBOX GALLERY
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

        // Gallery data
        var galleries = {
            'annual': {
                images: [],
                count: 12,
                prefix: 'annual-',
                ext: '.jpg'
            },
            'documentary': {
                images: [],
                count: 12,
                prefix: 'documentary-',
                ext: '.jpg'
            },
            'executive': {
                images: [],
                count: 3,
                prefix: 'executive-',
                ext: '.jpg'
            }
        };

        // Build image paths
        Object.keys(galleries).forEach(function(key) {
            var g = galleries[key];
            for (var i = 1; i <= g.count; i++) {
                var num = i < 10 ? '0' + i : '' + i;
                g.images.push('images/' + g.prefix + num + g.ext);
            }
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

            // Thumbnails
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

        // Close lightbox
        function closeLightboxFn() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Event listeners for gallery triggers
        var triggers = document.querySelectorAll('.gallery-trigger');
        triggers.forEach(function(trigger) {
            trigger.addEventListener('click', function() {
                var galleryKey = this.getAttribute('data-gallery');
                openLightbox(galleryKey);
            });
        });

        if (closeLightbox) {
            closeLightbox.addEventListener('click', closeLightboxFn);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', prevImage);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextImage);
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') {
                closeLightboxFn();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });

        // Close on click outside
        if (lightboxModal) {
            lightboxModal.addEventListener('click', function(e) {
                if (e.target === lightboxModal) {
                    closeLightboxFn();
                }
            });
        }
    })();

    // ============================================
    // FORM SUBMISSION HANDLER
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
        if (formContainer) {
            formContainer.appendChild(msgDiv);
        }

        setTimeout(function() {
            if (msgDiv) msgDiv.remove();
        }, 5000);
    }

    // ============================================
    // LAZY LOAD PREPARATION FOR IMAGES
    // ============================================
    var allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
        if (!img.src.includes('logo')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    console.log('THEUGRAPHY MEDIA website loaded successfully');

})();
