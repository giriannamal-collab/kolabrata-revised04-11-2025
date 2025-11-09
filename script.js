document.addEventListener("DOMContentLoaded", () => {

    // === 1. MOBILE MENU TOGGLE ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const headerNav = document.querySelector('.header-nav');

    if (mobileMenuBtn && headerNav) {
        mobileMenuBtn.addEventListener('click', () => {
            headerNav.classList.toggle('is-active');
            mobileMenuBtn.classList.toggle('is-active');
        });
    }

    // === 2. FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // === 3. SMOOTH SCROLL & ACTIVE NAV LINKS ===
    const navLinks = document.querySelectorAll('.header-nav-links a');
    const sections = document.querySelectorAll('section[id]');

    const smoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        
        if (headerNav && headerNav.classList.contains('is-active')) {
            headerNav.classList.remove('is-active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('is-active');
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    const updateActiveLink = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // === 4. PROCESS ANIMATION ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const stepObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const processSteps = document.querySelectorAll('.process-simple-step');
    processSteps.forEach(step => stepObserver.observe(step));

    // === 5. TESTIMONIALS CAROUSEL ===
    let currentStory = 0;
    const stories = document.querySelectorAll('.story-card');
    const dots = document.querySelectorAll('.dot');
    
    if (stories.length > 0 && dots.length > 0) {
        const totalStories = stories.length;

        const updateStories = () => {
            stories.forEach((story, index) => {
                story.classList.toggle('active', index === currentStory);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentStory);
                dot.setAttribute('aria-selected', index === currentStory);
            });
            animateCounters(stories[currentStory]);
        }

        const nextStory = () => {
            currentStory = (currentStory + 1) % totalStories;
            updateStories();
        }

        const prevStory = () => {
            currentStory = (currentStory - 1 + totalStories) % totalStories;
            updateStories();
        }

        const goToStory = (index) => {
            currentStory = index;
            updateStories();
        }

        window.nextStory = nextStory;
        window.prevStory = prevStory;
        window.goToStory = goToStory;

        const animateCounters = (story) => {
            if (!story) return;
            const counters = story.querySelectorAll('.stat-value');
            counters.forEach(counter => {
                let start = 0;
                const targetStr = counter.getAttribute('data-target') || '0';
                const target = Number(targetStr.replace(/,/g, '') || 0);
                let duration = 1500;
                // avoid division by zero
                let stepTime = target > 0 ? Math.max(Math.floor(duration / target), 10) : 20;
                
                if (target === 0) {
                    counter.textContent = targetStr;
                    return;
                }
                if (counter.textContent.trim() !== '0' && Number(counter.textContent.replace(/,/g, '')) !== target) {
                    counter.textContent = '0';
                } else if (Number(counter.textContent.replace(/,/g, '')) === target) {
                    return;
                }
                
                let count = start;
                const interval = setInterval(() => {
                    let increment = Math.ceil(target / (duration / stepTime));
                    count += increment;
                    
                    if (count >= target) {
                        count = target;
                        clearInterval(interval);
                    }
                    counter.textContent = count.toLocaleString();
                }, stepTime);
            });
        }

        let autoplay = setInterval(nextStory, 7000);

        const container = document.querySelector('.stories-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                clearInterval(autoplay);
            });
            container.addEventListener('mouseleave', () => {
                autoplay = setInterval(nextStory, 7000);
            });

            let startX = 0;
            let isDragging = false;
            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                clearInterval(autoplay);
            });
            container.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const moveX = e.touches[0].clientX;
                const diff = startX - moveX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextStory();
                    else prevStory();
                    isDragging = false;
                }
            });
            container.addEventListener('touchend', () => {
                isDragging = false;
                autoplay = setInterval(nextStory, 7000);
            });
        }

        document.addEventListener('keydown', (e) => {
            const testimonialsSection = document.getElementById('testimonials');
            if (testimonialsSection) {
                const rect = testimonialsSection.getBoundingClientRect();
                const inView = (rect.top >= 0 && rect.bottom <= window.innerHeight);
                if (inView) {
                    if (e.key === 'ArrowLeft') prevStory();
                    if (e.key === 'ArrowRight') nextStory();
                }
            }
        });

        updateStories();
    }

    // === 6. MODAL FUNCTIONALITY ===
    // Create overlay + shell + iframe (lazy-load contact.html)
    (function() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'contact-modal-overlay';
        modalOverlay.setAttribute('role', 'dialog');
        modalOverlay.setAttribute('aria-modal', 'true');
        modalOverlay.setAttribute('aria-hidden', 'true');

        const modalShell = document.createElement('div');
        modalShell.className = 'modal-shell';

        // close button (visible in parent overlay)
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close contact form');
        closeBtn.innerHTML = '&times;';

        const modalIframe = document.createElement('iframe');
        // lazy load: do not set src now to save initial load time
        // set the actual page path here for when we open
        modalIframe.dataset.src = 'contact.html';
        modalIframe.id = 'contact-iframe';
        modalIframe.className = 'modal-iframe';
        modalIframe.setAttribute('title', 'Contact form');
        modalIframe.setAttribute('frameborder', '0');
        modalIframe.setAttribute('allow', 'microphone; camera; clipboard-write; geolocation; payment');
        modalIframe.style.width = '100%';
        modalIframe.style.height = '100%';
        modalIframe.style.border = '0';
        modalIframe.style.background = '#fff';

        modalShell.appendChild(closeBtn);
        modalShell.appendChild(modalIframe);
        modalOverlay.appendChild(modalShell);
        document.body.appendChild(modalOverlay);

        // helper functions
        function openContactModal() {
            // set src if not set (lazy-load)
            if (!modalIframe.src || modalIframe.src === 'about:blank') {
                modalIframe.src = modalIframe.dataset.src;
            }
            modalOverlay.classList.add('open');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open'); // body.modal-open blocks scroll (CSS)
            // focus close button for accessibility
            closeBtn.focus();
        }

        function closeContactModal() {
            modalOverlay.classList.remove('open');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            // optional: stop iframe activity by blanking it; uncomment if desired
            // modalIframe.src = 'about:blank';
        }

        // open triggers:
        const headerBtn = document.getElementById('open-contact-btn');
        if (headerBtn) {
            headerBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openContactModal();
            });
        }

        // existing CTA anchors that go to #consultation
        const modalTriggers = document.querySelectorAll('a[href="#consultation"]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                openContactModal();
            });
        });

        // close actions
        closeBtn.addEventListener('click', closeContactModal);

        // clicking outside the shell closes modal
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeContactModal();
            }
        });

        // Escape to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
                closeContactModal();
            }
        });

        // Listen for postMessage from iframe (contact.html should post 'closeModal')
        window.addEventListener('message', function(event) {
            if (event && event.data === 'closeModal') {
                closeContactModal();
            }
        }, false);

        // Expose methods if needed
        window.openContactModal = openContactModal;
        window.closeContactModal = closeContactModal;
    })();

    // === 7. OLD CONSULTATION FORM (Keep for direct CTA method) ===
    const form = document.getElementById('consultationForm');
    const successOverlay = document.getElementById('successOverlay');
    const errorMessage = document.getElementById('errorMessage');

    if (form && successOverlay && errorMessage) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;

            if (name === '' || email === '' || service === '') {
                errorMessage.textContent = 'Please fill out all required fields.';
                errorMessage.style.display = 'block';
                return;
            }

            errorMessage.style.display = 'none';
            successOverlay.style.display = 'flex';
            form.reset();

            setTimeout(() => {
                successOverlay.style.display = 'none';
            }, 4000); 
        });
    }
});
