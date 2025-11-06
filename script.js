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
                // Check if this item is already open
                const isOpen = item.classList.contains('active');

                // Optional: Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // If it wasn't open, open it
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // === 3. CONSULTATION FORM SUBMISSION (Example) ===
    const form = document.getElementById('consultationForm');
    const successOverlay = document.getElementById('successOverlay');
    const errorMessage = document.getElementById('errorMessage');

    if (form && successOverlay && errorMessage) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the form from actually submitting
            
            // Basic validation example
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;

            if (name === '' || email === '' || service === '') {
                errorMessage.textContent = 'Please fill out all required fields.';
                errorMessage.style.display = 'block';
                return;
            }

            // If validation passes
            errorMessage.style.display = 'none';
            
            // Show the success message
            successOverlay.style.display = 'flex';

            // Reset the form
            form.reset();

            // Hide the success message after a few seconds
            setTimeout(() => {
                successOverlay.style.display = 'none';
            }, 4000); 
        });
    }

    // === 4. SMOOTH SCROLL & ACTIVE NAV LINKS ===
    const navLinks = document.querySelectorAll('.header-nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Function for smooth scrolling
    const smoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust 80 for header height
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu on click
        if (headerNav.classList.contains('is-active')) {
            headerNav.classList.remove('is-active');
            mobileMenuBtn.classList.remove('is-active');
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Function to update active nav link on scroll
    const updateActiveLink = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) { // 100px offset
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
    
    // Run once on load
    updateActiveLink();

    // === 5. TESTIMONIALS CAROUSEL ===
    // --- START TESTIMONIALS CAROUSEL LOGIC ---
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

        // Make functions globally accessible for inline onclick attributes
        window.nextStory = nextStory;
        window.prevStory = prevStory;
        window.goToStory = goToStory;

        const animateCounters = (story) => {
            if (!story) return;
            const counters = story.querySelectorAll('.stat-value');
            counters.forEach(counter => {
                let start = 0;
                const targetStr = counter.getAttribute('data-target');
                const target = Number(targetStr);
                let duration = 1500;
                let stepTime = Math.max(Math.floor(duration / target), 10);
                
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

        // Auto-play
        let autoplay = setInterval(nextStory, 7000);

        // Pause on hover
        const container = document.querySelector('.stories-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                clearInterval(autoplay);
            });
            container.addEventListener('mouseleave', () => {
                autoplay = setInterval(nextStory, 7000);
            });

            // Swipe support
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

        // Keyboard navigation
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

        // Initial load
        updateStories();
    }
    // --- END TESTIMONIALS CAROUSEL LOGIC ---

});