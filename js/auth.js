// ARTHROSHIELD - Authentication System
// Clean, dedicated authentication module

// Default users for testing
const DEFAULT_USERS = [
    {
        email: "dr.sarah@citymedical.com",
        password: "doctor123",
        role: "doctor",
        name: "Dr. Sarah Johnson",
        specialization: "Orthopedic Surgeon",
        hospital: "City Medical Center",
        phone: "+1 (555) 123-4567",
        createdAt: new Date().toISOString()
    },
    {
        email: "john.doe@email.com",
        password: "patient123",
        role: "patient",
        name: "John Doe",
        age: 45,
        gender: "male",
        createdAt: new Date().toISOString()
    }
];

// Initialize authentication system
function initAuth() {
    console.log('Initializing authentication system...');
    
    // Check if users exist, if not create default users
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    
    if (users.length === 0) {
        console.log('No users found, creating default users...');
        localStorage.setItem('arthrosheild_users', JSON.stringify(DEFAULT_USERS));
        console.log('Default users created:', DEFAULT_USERS);
    } else {
        console.log('Existing users found:', users);
    }
    
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('arthrosheild_current_user') || 'null');
    if (currentUser) {
        console.log('User already logged in:', currentUser);
        redirectToMainApp(currentUser);
    }
}

// Switch between login and signup tabs
function switchTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
    
    hideMessage();
}

// Toggle role-specific fields in signup
function toggleRoleFields() {
    const role = document.getElementById('signupRole').value;
    const doctorFields = document.getElementById('doctorFields');
    const patientFields = document.getElementById('patientFields');
    
    doctorFields.style.display = role === 'doctor' ? 'block' : 'none';
    patientFields.style.display = role === 'patient' ? 'block' : 'none';
}

// Show message
function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type} show`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideMessage();
    }, 3000);
}

// Hide message
function hideMessage() {
    const messageEl = document.getElementById('message');
    messageEl.className = 'message';
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Login attempt:', { email, password });
    
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        console.log('Login successful:', user);
        
        // Save current user
        localStorage.setItem('arthrosheild_current_user', JSON.stringify(user));
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to main app
        setTimeout(() => {
            redirectToMainApp(user);
        }, 1500);
    } else {
        console.log('Login failed: Invalid credentials');
        showMessage('Invalid email or password', 'error');
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    console.log('Signup attempt:', { name, email, password, role });
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showMessage('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        email,
        password,
        role,
        name,
        createdAt: new Date().toISOString()
    };
    
    // Add role-specific fields
    if (role === 'doctor') {
        newUser.specialization = document.getElementById('doctorSpecialization').value;
        newUser.hospital = document.getElementById('doctorHospital').value;
    } else if (role === 'patient') {
        newUser.age = parseInt(document.getElementById('patientAge').value);
        newUser.gender = document.getElementById('patientGender').value;
    }
    
    // Save user
    users.push(newUser);
    localStorage.setItem('arthrosheild_users', JSON.stringify(users));
    
    console.log('User created successfully:', newUser);
    
    showMessage('Account created successfully! You can now login...', 'success');
    
    // Switch to login tab
    setTimeout(() => {
        switchTab('login');
        // Pre-fill email
        document.getElementById('loginEmail').value = email;
    }, 1500);
}

// Quick login for testing
function quickLogin(role) {
    console.log('Quick login for:', role);
    
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    let user;
    
    if (role === 'doctor') {
        user = users.find(u => u.role === 'doctor');
    } else {
        user = users.find(u => u.role === 'patient');
    }
    
    if (user) {
        console.log('Quick login successful:', user);
        localStorage.setItem('arthrosheild_current_user', JSON.stringify(user));
        showMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful! Redirecting...`, 'success');
        
        setTimeout(() => {
            redirectToMainApp(user);
        }, 1000);
    } else {
        showMessage(`No ${role} user found`, 'error');
    }
}

// Redirect to main app
function redirectToMainApp(user) {
    console.log('Redirecting to main app with user:', user);
    
    // Store user info for main app
    localStorage.setItem('arthrosheild_current_user', JSON.stringify(user));
    
    // Redirect to main application
    window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth page loaded');
    initAuth();
});

// Make functions globally accessible
window.switchTab = switchTab;
window.toggleRoleFields = toggleRoleFields;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.quickLogin = quickLogin;
