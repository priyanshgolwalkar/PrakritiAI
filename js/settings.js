// Settings page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings page
    initializeSettingsPage();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Check authentication
    checkAuthentication();
    
    // Load current settings
    loadCurrentSettings();
});

// Global variables
let currentSettings = {};

// Page Initialization
function initializeSettingsPage() {
    loadDefaultSettings();
    populateSettingsForm();
}

// Authentication Check
function checkAuthentication() {
    const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    
    if (!userSession) {
        window.location.href = 'login.html';
        return;
    }
    
    const userData = JSON.parse(userSession);
    document.getElementById('currentUser').textContent = userData.username;
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('userSession');
            sessionStorage.removeItem('userSession');
            window.location.href = 'login.html';
        }
    });
}

// Dark Mode
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

// Sidebar Management
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('show');
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('show');
        });
    }
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            if (!sidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}

// Settings Management
function loadDefaultSettings() {
    currentSettings = {
        thresholds: {
            temperature: { min: 15, max: 40, optimal: { min: 20, max: 30 } },
            humidity: { min: 30, max: 80, optimal: { min: 50, max: 70 } },
            soil: { min: 30, max: 85, optimal: { min: 40, max: 70 } },
            ph: { min: 6.0, max: 8.0, optimal: { min: 6.5, max: 7.5 } },
            gas: { max: 500, critical: 1000 },
            light: { min: 200, max: 8000 }
        },
        notifications: {
            enableCriticalAlerts: true,
            enableWarningAlerts: true,
            enableInfoAlerts: true,
            refreshRate: 5000,
            enableSounds: true,
            soundVolume: 50,
            alertRetention: 30
        },
        system: {
            theme: 'light',
            layout: 'default'
        }
    };
}

function loadCurrentSettings() {
    // Load thresholds
    const savedThresholds = localStorage.getItem('sensorThresholds');
    if (savedThresholds) {
        currentSettings.thresholds = JSON.parse(savedThresholds);
    }
    
    // Load notification settings
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
        currentSettings.notifications = { ...currentSettings.notifications, ...JSON.parse(savedNotifications) };
    }
    
    // Load system settings
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentSettings.system.theme = savedTheme;
    }
    
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
        currentSettings.system.layout = savedLayout;
    }
    
    populateSettingsForm();
}

function populateSettingsForm() {
    // Populate threshold settings
    const thresholds = currentSettings.thresholds;
    
    // Temperature
    document.getElementById('tempMin').value = thresholds.temperature.min;
    document.getElementById('tempMax').value = thresholds.temperature.max;
    document.getElementById('tempOptimalMin').value = thresholds.temperature.optimal.min;
    document.getElementById('tempOptimalMax').value = thresholds.temperature.optimal.max;
    
    // Humidity
    document.getElementById('humidityMin').value = thresholds.humidity.min;
    document.getElementById('humidityMax').value = thresholds.humidity.max;
    document.getElementById('humidityOptimalMin').value = thresholds.humidity.optimal.min;
    document.getElementById('humidityOptimalMax').value = thresholds.humidity.optimal.max;
    
    // Soil Moisture
    document.getElementById('soilMin').value = thresholds.soil.min;
    document.getElementById('soilMax').value = thresholds.soil.max;
    document.getElementById('soilOptimalMin').value = thresholds.soil.optimal.min;
    document.getElementById('soilOptimalMax').value = thresholds.soil.optimal.max;
    
    // pH
    document.getElementById('phMin').value = thresholds.ph.min;
    document.getElementById('phMax').value = thresholds.ph.max;
    document.getElementById('phOptimalMin').value = thresholds.ph.optimal.min;
    document.getElementById('phOptimalMax').value = thresholds.ph.optimal.max;
    
    // Gas
    document.getElementById('gasMax').value = thresholds.gas.max;
    document.getElementById('gasCritical').value = thresholds.gas.critical;
    
    // Light
    document.getElementById('lightMin').value = thresholds.light.min;
    document.getElementById('lightMax').value = thresholds.light.max;
    
    // Populate notification settings
    const notifications = currentSettings.notifications;
    
    document.getElementById('enableCriticalAlerts').checked = notifications.enableCriticalAlerts;
    document.getElementById('enableWarningAlerts').checked = notifications.enableWarningAlerts;
    document.getElementById('enableInfoAlerts').checked = notifications.enableInfoAlerts;
    document.getElementById('refreshRate').value = notifications.refreshRate;
    document.getElementById('enableSounds').checked = notifications.enableSounds;
    document.getElementById('soundVolume').value = notifications.soundVolume;
    document.getElementById('alertRetention').value = notifications.alertRetention;
    
    // Populate system settings
    const system = currentSettings.system;
    
    document.getElementById('themeSelect').value = system.theme;
    document.getElementById('layoutSelect').value = system.layout;
}

function saveAllSettings() {
    try {
        // Collect threshold settings
        const thresholds = {
            temperature: {
                min: parseFloat(document.getElementById('tempMin').value),
                max: parseFloat(document.getElementById('tempMax').value),
                optimal: {
                    min: parseFloat(document.getElementById('tempOptimalMin').value),
                    max: parseFloat(document.getElementById('tempOptimalMax').value)
                }
            },
            humidity: {
                min: parseFloat(document.getElementById('humidityMin').value),
                max: parseFloat(document.getElementById('humidityMax').value),
                optimal: {
                    min: parseFloat(document.getElementById('humidityOptimalMin').value),
                    max: parseFloat(document.getElementById('humidityOptimalMax').value)
                }
            },
            soil: {
                min: parseFloat(document.getElementById('soilMin').value),
                max: parseFloat(document.getElementById('soilMax').value),
                optimal: {
                    min: parseFloat(document.getElementById('soilOptimalMin').value),
                    max: parseFloat(document.getElementById('soilOptimalMax').value)
                }
            },
            ph: {
                min: parseFloat(document.getElementById('phMin').value),
                max: parseFloat(document.getElementById('phMax').value),
                optimal: {
                    min: parseFloat(document.getElementById('phOptimalMin').value),
                    max: parseFloat(document.getElementById('phOptimalMax').value)
                }
            },
            gas: {
                max: parseFloat(document.getElementById('gasMax').value),
                critical: parseFloat(document.getElementById('gasCritical').value)
            },
            light: {
                min: parseFloat(document.getElementById('lightMin').value),
                max: parseFloat(document.getElementById('lightMax').value)
            }
        };
        
        // Validate thresholds
        if (!validateThresholds(thresholds)) {
            return;
        }
        
        // Collect notification settings
        const notifications = {
            enableCriticalAlerts: document.getElementById('enableCriticalAlerts').checked,
            enableWarningAlerts: document.getElementById('enableWarningAlerts').checked,
            enableInfoAlerts: document.getElementById('enableInfoAlerts').checked,
            refreshRate: parseInt(document.getElementById('refreshRate').value),
            enableSounds: document.getElementById('enableSounds').checked,
            soundVolume: parseInt(document.getElementById('soundVolume').value),
            alertRetention: parseInt(document.getElementById('alertRetention').value)
        };
        
        // Collect system settings
        const system = {
            theme: document.getElementById('themeSelect').value,
            layout: document.getElementById('layoutSelect').value
        };
        
        // Save to localStorage
        localStorage.setItem('sensorThresholds', JSON.stringify(thresholds));
        localStorage.setItem('notificationSettings', JSON.stringify(notifications));
        localStorage.setItem('theme', system.theme);
        localStorage.setItem('dashboardLayout', system.layout);
        
        // Apply theme change immediately
        setTheme(system.theme);
        
        // Update current settings
        currentSettings = { thresholds, notifications, system };
        
        showMessage('All settings saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showMessage('Error saving settings. Please try again.', 'error');
    }
}

function validateThresholds(thresholds) {
    const errors = [];
    
    // Temperature validation
    if (thresholds.temperature.min >= thresholds.temperature.max) {
        errors.push('Temperature: Minimum must be less than maximum');
    }
    if (thresholds.temperature.optimal.min >= thresholds.temperature.optimal.max) {
        errors.push('Temperature: Optimal minimum must be less than optimal maximum');
    }
    
    // Humidity validation
    if (thresholds.humidity.min >= thresholds.humidity.max) {
        errors.push('Humidity: Minimum must be less than maximum');
    }
    if (thresholds.humidity.optimal.min >= thresholds.humidity.optimal.max) {
        errors.push('Humidity: Optimal minimum must be less than optimal maximum');
    }
    
    // Soil validation
    if (thresholds.soil.min >= thresholds.soil.max) {
        errors.push('Soil Moisture: Minimum must be less than maximum');
    }
    if (thresholds.soil.optimal.min >= thresholds.soil.optimal.max) {
        errors.push('Soil Moisture: Optimal minimum must be less than optimal maximum');
    }
    
    // pH validation
    if (thresholds.ph.min >= thresholds.ph.max) {
        errors.push('pH: Minimum must be less than maximum');
    }
    if (thresholds.ph.optimal.min >= thresholds.ph.optimal.max) {
        errors.push('pH: Optimal minimum must be less than optimal maximum');
    }
    
    // Gas validation
    if (thresholds.gas.max >= thresholds.gas.critical) {
        errors.push('Gas: Maximum must be less than critical level');
    }
    
    // Light validation
    if (thresholds.light.min >= thresholds.light.max) {
        errors.push('Light: Minimum must be less than maximum');
    }
    
    if (errors.length > 0) {
        showMessage('Validation errors:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
        // Clear all saved settings
        localStorage.removeItem('sensorThresholds');
        localStorage.removeItem('notificationSettings');
        localStorage.removeItem('dashboardLayout');
        
        // Reset to defaults
        loadDefaultSettings();
        populateSettingsForm();
        
        showMessage('Settings reset to default values', 'success');
    }
}

function exportData() {
    try {
        const exportData = {
            settings: currentSettings,
            alerts: JSON.parse(localStorage.getItem('systemAlerts') || '[]'),
            userSession: JSON.parse(localStorage.getItem('userSession') || '{}'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `prakriti-ai-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showMessage('Data exported successfully', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showMessage('Error exporting data. Please try again.', 'error');
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This will remove all settings, alerts, and user data. This action cannot be undone.')) {
        if (confirm('This is your final warning. All data will be permanently deleted. Continue?')) {
            // Clear all localStorage data
            const keysToKeep = ['theme']; // Keep theme preference
            const allKeys = Object.keys(localStorage);
            
            allKeys.forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear sessionStorage
            sessionStorage.clear();
            
            showMessage('All data cleared successfully. Redirecting to login...', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
}

function clearAlertHistory() {
    if (confirm('Are you sure you want to clear all alert history?')) {
        localStorage.removeItem('systemAlerts');
        showMessage('Alert history cleared successfully', 'success');
    }
}

// Event Listeners
function initializeEventListeners() {
    // Save all settings button
    const saveAllBtn = document.getElementById('saveAllSettings');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllSettings);
    }
    
    // Export data button
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    // Reset settings button
    const resetBtn = document.getElementById('resetSettings');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);
    }
    
    // Clear all data button
    const clearDataBtn = document.getElementById('clearAllData');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
    
    // Clear alert history button
    const clearAlertsBtn = document.getElementById('clearAlertHistory');
    if (clearAlertsBtn) {
        clearAlertsBtn.addEventListener('click', clearAlertHistory);
    }
    
    // Theme select change
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            setTheme(this.value);
        });
    }
    
    // Sound volume slider
    const soundVolume = document.getElementById('soundVolume');
    if (soundVolume) {
        soundVolume.addEventListener('input', function() {
            // Could add a preview sound here
        });
    }
    
    // Real-time validation for threshold inputs
    const thresholdInputs = document.querySelectorAll('input[type="number"]');
    thresholdInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (isNaN(value)) {
        input.classList.add('is-invalid');
        return false;
    }
    
    if (min !== undefined && value < min) {
        input.classList.add('is-invalid');
        return false;
    }
    
    if (max !== undefined && value > max) {
        input.classList.add('is-invalid');
        return false;
    }
    
    input.classList.remove('is-invalid');
    return true;
}

// Utility Functions
function showMessage(message, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type} fade-in`;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '100px';
    messageContainer.style.right = '20px';
    messageContainer.style.zIndex = '9999';
    messageContainer.style.minWidth = '300px';
    messageContainer.style.whiteSpace = 'pre-line';
    messageContainer.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.remove();
    }, type === 'error' ? 7000 : 4000);
}

// Update alert badge
function updateAlertBadge() {
    const alertBadge = document.getElementById('alertBadge');
    if (alertBadge) {
        const alerts = JSON.parse(localStorage.getItem('systemAlerts') || '[]');
        const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged).length;
        alertBadge.textContent = unacknowledgedAlerts;
        alertBadge.style.display = unacknowledgedAlerts > 0 ? 'inline' : 'none';
    }
}

// Initialize alert badge on page load
updateAlertBadge();