// Main JavaScript file for homepage functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize counter animations
    initializeCounters();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

function setTheme(theme) {
    document.body.setAttribute('data-bs-theme', theme);
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-sun';
        } else {
            icon.className = 'bi bi-moon';
        }
    }
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
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
}

// Utility Functions
function showMessage(message, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type} fade-in`;
    messageContainer.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
}

// Export functions for use in other files
window.PrakritiAI = {
    setTheme,
    showMessage
};