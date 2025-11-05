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

});