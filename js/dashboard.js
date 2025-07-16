// Dashboard JavaScript with real-time IoT simulation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize charts
    initializeCharts();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Check authentication
    checkAuthentication();
});

// Global variables
let sensorData = {
    temperature: [],
    humidity: [],
    soil: [],
    ph: [],
    gas: [],
    light: []
};

let charts = {};
let updateInterval;
let alertCount = 0;

// Dashboard Initialization
function initializeDashboard() {
    updateLastUpdatedTime();
    generateInitialData();
    updateSensorCards();
    updateActivityLog();
    updateAlertBadge();
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
            
            // Update charts for theme change
            setTimeout(() => {
                updateChartsTheme();
            }, 100);
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

// Data Generation
function generateInitialData() {
    const now = new Date();
    
    // Generate 24 hours of historical data
    for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
        
        sensorData.temperature.push({
            time: timestamp,
            value: generateSensorValue('temperature')
        });
        
        sensorData.humidity.push({
            time: timestamp,
            value: generateSensorValue('humidity')
        });
        
        sensorData.soil.push({
            time: timestamp,
            value: generateSensorValue('soil')
        });
        
        sensorData.ph.push({
            time: timestamp,
            value: generateSensorValue('ph')
        });
        
        sensorData.gas.push({
            time: timestamp,
            value: generateSensorValue('gas')
        });
        
        sensorData.light.push({
            time: timestamp,
            value: generateSensorValue('light')
        });
    }
}

function generateSensorValue(type) {
    const ranges = {
        temperature: { min: 15, max: 45, optimal: { min: 20, max: 30 } },
        humidity: { min: 20, max: 90, optimal: { min: 50, max: 70 } },
        soil: { min: 10, max: 95, optimal: { min: 40, max: 70 } },
        ph: { min: 5.0, max: 9.0, optimal: { min: 6.5, max: 7.5 } },
        gas: { min: 0, max: 1500, optimal: { min: 0, max: 500 } },
        light: { min: 0, max: 10000, optimal: { min: 200, max: 8000 } }
    };
    
    const range = ranges[type];
    const value = Math.random() * (range.max - range.min) + range.min;
    
    // Add some realistic variation
    if (type === 'ph') {
        return Math.round(value * 10) / 10; // 1 decimal place
    }
    
    return Math.round(value);
}

// Sensor Cards Update
function updateSensorCards() {
    const currentValues = {
        temperature: sensorData.temperature[sensorData.temperature.length - 1]?.value || 0,
        humidity: sensorData.humidity[sensorData.humidity.length - 1]?.value || 0,
        soil: sensorData.soil[sensorData.soil.length - 1]?.value || 0,
        ph: sensorData.ph[sensorData.ph.length - 1]?.value || 0,
        gas: sensorData.gas[sensorData.gas.length - 1]?.value || 0,
        light: sensorData.light[sensorData.light.length - 1]?.value || 0
    };
    
    // Update values and status
    updateSensorCard('temperature', currentValues.temperature, '°C');
    updateSensorCard('humidity', currentValues.humidity, '%');
    updateSensorCard('soil', currentValues.soil, '%');
    updateSensorCard('ph', currentValues.ph, '');
    updateSensorCard('gas', currentValues.gas, ' ppm');
    updateSensorCard('light', currentValues.light, ' lux');
    
    updateLastUpdatedTime();
}

function updateSensorCard(type, value, unit) {
    const valueElement = document.getElementById(`${type}Value`);
    const statusElement = document.getElementById(`${type}Status`);
    
    if (valueElement) {
        valueElement.textContent = value + unit;
    }
    
    if (statusElement) {
        const status = getSensorStatus(type, value);
        statusElement.textContent = status.text;
        statusElement.className = `sensor-status ${status.class}`;
    }
}

function getSensorStatus(type, value) {
    const thresholds = getThresholds();
    const threshold = thresholds[type];
    
    if (!threshold) return { text: 'Unknown', class: 'normal' };
    
    if (type === 'gas') {
        if (value > threshold.critical) return { text: 'Critical', class: 'critical' };
        if (value > threshold.max) return { text: 'High', class: 'warning' };
        return { text: 'Normal', class: 'normal' };
    }
    
    if (value < threshold.min || value > threshold.max) {
        return { text: 'Critical', class: 'critical' };
    }
    
    if (threshold.optimal && (value < threshold.optimal.min || value > threshold.optimal.max)) {
        return { text: 'Warning', class: 'warning' };
    }
    
    return { text: 'Normal', class: 'normal' };
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

// Charts Initialization
function initializeCharts() {
    initializeTrendChart();
    initializeStatusChart();
}

function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    const isDark = document.body.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#666666';
    const gridColor = isDark ? '#404040' : '#e0e0e0';
    
    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sensorData.temperature.map(data => 
                data.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            ),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: sensorData.temperature.map(data => data.value),
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: sensorData.humidity.map(data => data.value),
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Soil Moisture (%)',
                    data: sensorData.soil.map(data => data.value),
                    borderColor: '#6f42c1',
                    backgroundColor: 'rgba(111, 66, 193, 0.1)',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function initializeStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    const isDark = document.body.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#666666';
    
    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Normal', 'Warning', 'Critical'],
            datasets: [{
                data: [5, 1, 0], // Will be updated dynamically
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderWidth: 2,
                borderColor: isDark ? '#2d2d2d' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 20
                    }
                }
            }
        }
    });
}

function updateChartsTheme() {
    const isDark = document.body.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#666666';
    const gridColor = isDark ? '#404040' : '#e0e0e0';
    
    if (charts.trend) {
        charts.trend.options.plugins.legend.labels.color = textColor;
        charts.trend.options.scales.x.ticks.color = textColor;
        charts.trend.options.scales.x.grid.color = gridColor;
        charts.trend.options.scales.y.ticks.color = textColor;
        charts.trend.options.scales.y.grid.color = gridColor;
        charts.trend.update();
    }
    
    if (charts.status) {
        charts.status.options.plugins.legend.labels.color = textColor;
        charts.status.data.datasets[0].borderColor = isDark ? '#2d2d2d' : '#ffffff';
        charts.status.update();
    }
}

// Real-time Updates
function startRealTimeUpdates() {
    const refreshSelect = document.getElementById('refreshRate');
    let interval = 5000; // Default 5 seconds
    
    if (refreshSelect) {
        interval = parseInt(refreshSelect.value) || 5000;
        refreshSelect.addEventListener('change', function() {
            clearInterval(updateInterval);
            interval = parseInt(this.value) || 5000;
            startUpdateLoop(interval);
        });
    }
    
    startUpdateLoop(interval);
}

function startUpdateLoop(interval) {
    updateInterval = setInterval(() => {
        updateSensorData();
        updateSensorCards();
        updateCharts();
        checkAlerts();
        updateActivityLog();
    }, interval);
}

function updateSensorData() {
    const now = new Date();
    
    // Add new data point for each sensor
    Object.keys(sensorData).forEach(sensorType => {
        const newValue = generateSensorValue(sensorType);
        sensorData[sensorType].push({
            time: now,
            value: newValue
        });
        
        // Keep only last 24 data points
        if (sensorData[sensorType].length > 24) {
            sensorData[sensorType].shift();
        }
    });
}

function updateCharts() {
    if (charts.trend) {
        charts.trend.data.labels = sensorData.temperature.map(data => 
            data.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        );
        charts.trend.data.datasets[0].data = sensorData.temperature.map(data => data.value);
        charts.trend.data.datasets[1].data = sensorData.humidity.map(data => data.value);
        charts.trend.data.datasets[2].data = sensorData.soil.map(data => data.value);
        charts.trend.update('none');
    }
    
    updateStatusChart();
}

function updateStatusChart() {
    if (!charts.status) return;
    
    const currentValues = {
        temperature: sensorData.temperature[sensorData.temperature.length - 1]?.value || 0,
        humidity: sensorData.humidity[sensorData.humidity.length - 1]?.value || 0,
        soil: sensorData.soil[sensorData.soil.length - 1]?.value || 0,
        ph: sensorData.ph[sensorData.ph.length - 1]?.value || 0,
        gas: sensorData.gas[sensorData.gas.length - 1]?.value || 0,
        light: sensorData.light[sensorData.light.length - 1]?.value || 0
    };
    
    let normal = 0, warning = 0, critical = 0;
    
    Object.keys(currentValues).forEach(type => {
        const status = getSensorStatus(type, currentValues[type]);
        if (status.class === 'normal') normal++;
        else if (status.class === 'warning') warning++;
        else if (status.class === 'critical') critical++;
    });
    
    charts.status.data.datasets[0].data = [normal, warning, critical];
    charts.status.update('none');
}

// Alert System
function checkAlerts() {
    const currentValues = {
        temperature: sensorData.temperature[sensorData.temperature.length - 1]?.value || 0,
        humidity: sensorData.humidity[sensorData.humidity.length - 1]?.value || 0,
        soil: sensorData.soil[sensorData.soil.length - 1]?.value || 0,
        ph: sensorData.ph[sensorData.ph.length - 1]?.value || 0,
        gas: sensorData.gas[sensorData.gas.length - 1]?.value || 0,
        light: sensorData.light[sensorData.light.length - 1]?.value || 0
    };
    
    let newAlerts = 0;
    
    Object.keys(currentValues).forEach(type => {
        const status = getSensorStatus(type, currentValues[type]);
        if (status.class === 'critical' || status.class === 'warning') {
            newAlerts++;
        }
    });
    
    alertCount = newAlerts;
    updateAlertBadge();
}

function updateAlertBadge() {
    const alertBadge = document.getElementById('alertBadge');
    if (alertBadge) {
        alertBadge.textContent = alertCount;
        alertBadge.style.display = alertCount > 0 ? 'inline' : 'none';
    }
}

// Activity Log
function updateActivityLog() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = generateRecentActivities();
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="bi bi-${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function generateRecentActivities() {
    const activities = [
        {
            title: 'Temperature sensor reading updated',
            time: '2 minutes ago',
            icon: 'thermometer-half',
            type: 'info'
        },
        {
            title: 'Soil moisture level optimal',
            time: '5 minutes ago',
            icon: 'droplet',
            type: 'success'
        },
        {
            title: 'pH level within normal range',
            time: '8 minutes ago',
            icon: 'flask',
            type: 'info'
        },
        {
            title: 'System health check completed',
            time: '15 minutes ago',
            icon: 'check-circle',
            type: 'success'
        },
        {
            title: 'Data backup completed',
            time: '1 hour ago',
            icon: 'cloud-upload',
            type: 'info'
        }
    ];
    
    return activities;
}

// Event Listeners
function initializeEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateSensorData();
            updateSensorCards();
            updateCharts();
            showMessage('Data refreshed successfully', 'success');
        });
    }
    
    // Sensor filter
    const sensorSelect = document.getElementById('sensorSelect');
    if (sensorSelect) {
        sensorSelect.addEventListener('change', function() {
            filterSensorData(this.value);
        });
    }
    
    // Chart time range
    const chartTimeRange = document.getElementById('chartTimeRange');
    if (chartTimeRange) {
        chartTimeRange.addEventListener('change', function() {
            updateChartTimeRange(this.value);
        });
    }
}

function filterSensorData(sensorType) {
    if (sensorType === 'all') {
        // Show all sensors
        document.querySelectorAll('.sensor-card').forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Hide all, show selected
        document.querySelectorAll('.sensor-card').forEach(card => {
            card.style.display = 'none';
        });
        
        const targetCard = document.querySelector(`[id*="${sensorType}"]`).closest('.sensor-card');
        if (targetCard) {
            targetCard.style.display = 'block';
        }
    }
}

function updateChartTimeRange(range) {
    // This would update the chart data based on selected time range
    // For now, we'll just show a message
    showMessage(`Chart updated to show ${range}`, 'info');
}

// Utility Functions
function updateLastUpdatedTime() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = new Date().toLocaleTimeString();
    }
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
    }, 3000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});