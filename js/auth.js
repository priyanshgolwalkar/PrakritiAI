// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize login form
    initializeLoginForm();
    
    // Initialize signup form
    initializeSignupForm();
    
    // Initialize password toggles
    initializePasswordToggles();
    
    // Check if user is already logged in
    checkAuthStatus();
});

// Dark Mode (reuse from main.js)
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
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

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Client-side validation
            if (!validateLogin(username, password)) {
                return;
            }
            
            // Dummy authentication (replace with real authentication)
            if (username === 'admin' && password === 'admin123') {
                // Store user session
                const userData = {
                    username: username,
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMe
                };
                
                if (rememberMe) {
                    localStorage.setItem('userSession', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('userSession', JSON.stringify(userData));
                }
                
                showMessage('Login successful! Redirecting to dashboard...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage('Invalid username or password. Please try again.', 'error');
                clearFormErrors();
                showFieldError('username', 'Invalid credentials');
                showFieldError('password', 'Invalid credentials');
            }
        });
    }
}

// Signup Form
function initializeSignupForm() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                username: document.getElementById('signupUsername').value,
                password: document.getElementById('signupPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                agreeTerms: document.getElementById('agreeTerms').checked
            };
            
            // Client-side validation
            if (!validateSignup(formData)) {
                return;
            }
            
            // Store user data (in real app, this would be sent to server)
            const userData = {
                ...formData,
                id: generateUserId(),
                registrationDate: new Date().toISOString()
            };
            
            // Remove password from stored data
            delete userData.password;
            delete userData.confirmPassword;
            
            localStorage.setItem('registeredUser', JSON.stringify(userData));
            
            showMessage('Account created successfully! You can now log in.', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
}

// Password Toggle
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('[id^="toggle"]');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('toggle', '').replace('Signup', 'signup');
            const passwordField = document.getElementById(targetId + 'Password') || 
                                 document.getElementById('password') ||
                                 document.getElementById('confirmPassword');
            
            if (passwordField) {
                const icon = this.querySelector('i');
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.className = 'bi bi-eye-slash';
                } else {
                    passwordField.type = 'password';
                    icon.className = 'bi bi-eye';
                }
            }
        });
    });
}

// Authentication Status Check
function checkAuthStatus() {
    const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    
    if (userSession && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Validation Functions
function validateLogin(username, password) {
    let isValid = true;
    clearFormErrors();
    
    if (!username.trim()) {
        showFieldError('username', 'Username is required');
        isValid = false;
    }
    
    if (!password.trim()) {
        showFieldError('password', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateSignup(data) {
    let isValid = true;
    clearFormErrors();
    
    // First Name validation
    if (!data.firstName.trim()) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }
    
    // Last Name validation
    if (!data.lastName.trim()) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Username validation
    if (!data.username.trim()) {
        showFieldError('signupUsername', 'Username is required');
        isValid = false;
    } else if (data.username.length < 3) {
        showFieldError('signupUsername', 'Username must be at least 3 characters long');
        isValid = false;
    }
    
    // Password validation
    if (!data.password.trim()) {
        showFieldError('signupPassword', 'Password is required');
        isValid = false;
    } else if (data.password.length < 8) {
        showFieldError('signupPassword', 'Password must be at least 8 characters long');
        isValid = false;
    }
    
    // Confirm Password validation
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms agreement validation
    if (!data.agreeTerms) {
        showFieldError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Error Display Functions
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback') || 
                        field.closest('.form-check').querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }
}

function clearFormErrors() {
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.classList.remove('is-invalid');
    });
    
    const feedbacks = document.querySelectorAll('.invalid-feedback');
    feedbacks.forEach(feedback => {
        feedback.textContent = '';
    });
}

// Utility Functions
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function showMessage(message, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type} fade-in`;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '100px';
    messageContainer.style.right = '20px';
    messageContainer.style.zIndex = '9999';
    messageContainer.style.minWidth = '300px';
    messageContainer.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
}

// Logout function (for use in other pages)
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    window.location.href = 'login.html';
}

// Export functions
window.PrakritiAuth = {
    logout,
    checkAuthStatus
};