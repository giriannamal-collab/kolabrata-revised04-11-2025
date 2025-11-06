// --- START TESTIMONIALS CAROUSEL LOGIC ---
let currentStory = 0;
const stories = document.querySelectorAll('.story-card');
const dots = document.querySelectorAll('.dot');
const totalStories = stories.length;

function updateStories() {
    stories.forEach((story, index) => {
        if (index === currentStory) {
            story.classList.add('active');
        } else {
            story.classList.remove('active');
        }
    });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentStory);
        dot.setAttribute('aria-selected', index === currentStory);
    });
    animateCounters(stories[currentStory]);
}

function nextStory() {
    currentStory = (currentStory + 1) % totalStories;
    updateStories();
}

function prevStory() {
    currentStory = (currentStory - 1 + totalStories) % totalStories;
    updateStories();
}

function goToStory(index) {
    currentStory = index;
    updateStories();
}

function animateCounters(story) {
    if (!story) return; // Add a check
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
            // Reset to 0 if re-animated
            counter.textContent = '0';
        } else if (Number(counter.textContent.replace(/,/g, '')) === target) {
            return; // Already animated
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

    // Swipe support for touch devices
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
            if (diff > 0) {
                nextStory();
            } else {
                prevStory();
            }
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
    // Check if the testimonials section is in view
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
window.addEventListener('load', () => {
    if (stories.length > 0) {
        updateStories();
    }
});
// --- END TESTIMONIALS CAROUSEL LOGIC ---