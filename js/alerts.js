// Alerts page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize alerts page
    initializeAlertsPage();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Check authentication
    checkAuthentication();
    
    // Load alerts
    loadAlerts();
});

// Global variables
let alerts = [];
let alertCounts = {
    critical: 0,
    warning: 0,
    info: 0,
    total: 0
};

// Page Initialization
function initializeAlertsPage() {
    generateSampleAlerts();
    updateAlertCounts();
    displayAlerts();
    loadQuickSettings();
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

// Alert Generation
function generateSampleAlerts() {
    const now = new Date();
    const thresholds = getThresholds();
    
    alerts = [
        {
            id: 1,
            type: 'critical',
            sensor: 'Temperature',
            title: 'High Temperature Alert',
            description: `Temperature reading of 42°C exceeds maximum threshold of ${thresholds.temperature.max}°C`,
            timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
            value: 42,
            unit: '°C',
            acknowledged: false
        },
        {
            id: 2,
            type: 'warning',
            sensor: 'Humidity',
            title: 'High Humidity Warning',
            description: `Humidity level of 85% is above optimal range (${thresholds.humidity.optimal.min}-${thresholds.humidity.optimal.max}%)`,
            timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
            value: 85,
            unit: '%',
            acknowledged: false
        },
        {
            id: 3,
            type: 'critical',
            sensor: 'Gas',
            title: 'Dangerous Gas Level',
            description: `Gas concentration of 1200 ppm exceeds critical threshold of ${thresholds.gas.critical} ppm`,
            timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
            value: 1200,
            unit: ' ppm',
            acknowledged: false
        },
        {
            id: 4,
            type: 'warning',
            sensor: 'Soil Moisture',
            title: 'Low Soil Moisture',
            description: `Soil moisture at 25% is below minimum threshold of ${thresholds.soil.min}%`,
            timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
            value: 25,
            unit: '%',
            acknowledged: true
        },
        {
            id: 5,
            type: 'info',
            sensor: 'pH',
            title: 'pH Level Notice',
            description: `pH level of 8.2 is slightly above optimal range (${thresholds.ph.optimal.min}-${thresholds.ph.optimal.max})`,
            timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
            value: 8.2,
            unit: '',
            acknowledged: true
        },
        {
            id: 6,
            type: 'warning',
            sensor: 'Light',
            title: 'Low Light Level',
            description: `Light level of 150 lux is below minimum threshold of ${thresholds.light.min} lux`,
            timestamp: new Date(now.getTime() - 90 * 60 * 1000), // 1.5 hours ago
            value: 150,
            unit: ' lux',
            acknowledged: true
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('systemAlerts', JSON.stringify(alerts));
}

function getThresholds() {
    const defaultThresholds = {
        temperature: { min: 15, max: 40, optimal: { min: 20, max: 30 } },
        humidity: { min: 30, max: 80, optimal: { min: 50, max: 70 } },
        soil: { min: 30, max: 85, optimal: { min: 40, max: 70 } },
        ph: { min: 6.0, max: 8.0, optimal: { min: 6.5, max: 7.5 } },
        gas: { max: 500, critical: 1000 },
        light: { min: 200, max: 8000 }
    };
    
    const savedThresholds = localStorage.getItem('sensorThresholds');
    return savedThresholds ? JSON.parse(savedThresholds) : defaultThresholds;
}

// Alert Display
function loadAlerts() {
    const savedAlerts = localStorage.getItem('systemAlerts');
    if (savedAlerts) {
        alerts = JSON.parse(savedAlerts);
        // Convert timestamp strings back to Date objects
        alerts.forEach(alert => {
            alert.timestamp = new Date(alert.timestamp);
        });
    }
    
    updateAlertCounts();
    displayAlerts();
    updateAlertBadge();
}

function updateAlertCounts() {
    alertCounts = {
        critical: alerts.filter(alert => alert.type === 'critical' && !alert.acknowledged).length,
        warning: alerts.filter(alert => alert.type === 'warning' && !alert.acknowledged).length,
        info: alerts.filter(alert => alert.type === 'info' && !alert.acknowledged).length,
        total: alerts.filter(alert => !alert.acknowledged).length
    };
    
    // Update count displays
    document.getElementById('criticalCount').textContent = alertCounts.critical;
    document.getElementById('warningCount').textContent = alertCounts.warning;
    document.getElementById('infoCount').textContent = alertCounts.info;
    document.getElementById('totalCount').textContent = alertCounts.total;
}

function displayAlerts(filter = 'all') {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    let filteredAlerts = alerts;
    
    if (filter !== 'all') {
        filteredAlerts = alerts.filter(alert => alert.type === filter);
    }
    
    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (filteredAlerts.length === 0) {
        alertsList.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-check-circle text-success fs-1 mb-3"></i>
                <h5>No alerts found</h5>
                <p class="text-muted">All systems are operating normally.</p>
            </div>
        `;
        return;
    }
    
    alertsList.innerHTML = filteredAlerts.map(alert => `
        <div class="alert-item ${alert.acknowledged ? 'acknowledged' : ''}" data-alert-id="${alert.id}">
            <div class="alert-icon ${alert.type}">
                <i class="bi bi-${getAlertIcon(alert.type)}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-description">${alert.description}</div>
                <div class="alert-timestamp">
                    <i class="bi bi-clock me-1"></i>
                    ${formatTimestamp(alert.timestamp)}
                    ${alert.acknowledged ? '<span class="badge bg-secondary ms-2">Acknowledged</span>' : ''}
                </div>
            </div>
            <div class="alert-actions">
                ${!alert.acknowledged ? `
                    <button class="btn btn-sm btn-outline-success me-2" onclick="acknowledgeAlert(${alert.id})">
                        <i class="bi bi-check"></i>
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-outline-danger" onclick="dismissAlert(${alert.id})">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getAlertIcon(type) {
    const icons = {
        critical: 'exclamation-triangle-fill',
        warning: 'exclamation-circle-fill',
        info: 'info-circle-fill'
    };
    return icons[type] || 'bell';
}

function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// Alert Actions
function acknowledgeAlert(alertId) {
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
        alerts[alertIndex].acknowledged = true;
        localStorage.setItem('systemAlerts', JSON.stringify(alerts));
        
        updateAlertCounts();
        displayAlerts();
        updateAlertBadge();
        
        showMessage('Alert acknowledged successfully', 'success');
    }
}

function dismissAlert(alertId) {
    if (confirm('Are you sure you want to dismiss this alert?')) {
        alerts = alerts.filter(alert => alert.id !== alertId);
        localStorage.setItem('systemAlerts', JSON.stringify(alerts));
        
        updateAlertCounts();
        displayAlerts();
        updateAlertBadge();
        
        showMessage('Alert dismissed successfully', 'success');
    }
}

function clearAllAlerts() {
    if (confirm('Are you sure you want to clear all alerts? This action cannot be undone.')) {
        alerts = [];
        localStorage.setItem('systemAlerts', JSON.stringify(alerts));
        
        updateAlertCounts();
        displayAlerts();
        updateAlertBadge();
        
        showMessage('All alerts cleared successfully', 'success');
    }
}

function updateAlertBadge() {
    const alertBadge = document.getElementById('alertBadge');
    if (alertBadge) {
        alertBadge.textContent = alertCounts.total;
        alertBadge.style.display = alertCounts.total > 0 ? 'inline' : 'none';
    }
}

// Quick Settings
function loadQuickSettings() {
    const thresholds = getThresholds();
    
    document.getElementById('quickTempMax').value = thresholds.temperature.max;
    document.getElementById('quickHumidityMax').value = thresholds.humidity.max;
    document.getElementById('quickSoilMin').value = thresholds.soil.min;
    document.getElementById('quickPhMax').value = thresholds.ph.max;
    document.getElementById('quickGasMax').value = thresholds.gas.max;
}

function updateQuickSettings() {
    const newThresholds = {
        temperature: { 
            min: 15, 
            max: parseInt(document.getElementById('quickTempMax').value),
            optimal: { min: 20, max: 30 }
        },
        humidity: { 
            min: 30, 
            max: parseInt(document.getElementById('quickHumidityMax').value),
            optimal: { min: 50, max: 70 }
        },
        soil: { 
            min: parseInt(document.getElementById('quickSoilMin').value),
            max: 85,
            optimal: { min: 40, max: 70 }
        },
        ph: { 
            min: 6.0, 
            max: parseFloat(document.getElementById('quickPhMax').value),
            optimal: { min: 6.5, max: 7.5 }
        },
        gas: { 
            max: parseInt(document.getElementById('quickGasMax').value),
            critical: 1000
        },
        light: { min: 200, max: 8000 }
    };
    
    localStorage.setItem('sensorThresholds', JSON.stringify(newThresholds));
    showMessage('Threshold settings updated successfully', 'success');
}

// Event Listeners
function initializeEventListeners() {
    // Alert filter
    const alertFilter = document.getElementById('alertFilter');
    if (alertFilter) {
        alertFilter.addEventListener('change', function() {
            displayAlerts(this.value);
        });
    }
    
    // Clear all alerts button
    const clearAllBtn = document.getElementById('clearAllAlerts');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllAlerts);
    }
    
    // Quick settings update button
    const updateQuickBtn = document.getElementById('updateQuickSettings');
    if (updateQuickBtn) {
        updateQuickBtn.addEventListener('click', updateQuickSettings);
    }
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
    messageContainer.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

// Make functions globally available
window.acknowledgeAlert = acknowledgeAlert;
window.dismissAlert = dismissAlert;