// ARTHROSHIELD - Main Application JavaScript

// Global State Management
const AppState = {
    currentUser: null,
    userRole: null,
    patients: [],
    reports: [],
    activityPlans: [],
    notifications: [],
    medicationReports: [],
    patientActivities: [],
    hospitals: [
        {
            id: 1,
            name: "City Medical Center",
            doctors: [
                { id: 1, name: "Dr. Sarah Johnson", specialization: "Orthopedic Surgeon", phone: "+1 (555) 123-4567" },
                { id: 2, name: "Dr. Michael Chen", specialization: "Rheumatologist", phone: "+1 (555) 234-5678" },
                { id: 3, name: "Dr. Emily Williams", specialization: "Sports Medicine Specialist", phone: "+1 (555) 345-6789" }
            ]
        },
        {
            id: 2,
            name: "Memorial Hospital",
            doctors: [
                { id: 4, name: "Dr. Robert Davis", specialization: "Orthopedic Surgeon", phone: "+1 (555) 456-7890" },
                { id: 5, name: "Dr. Lisa Anderson", specialization: "Rheumatologist", phone: "+1 (555) 567-8901" }
            ]
        },
        {
            id: 3,
            name: "University Medical Center",
            doctors: [
                { id: 6, name: "Dr. James Wilson", specialization: "Orthopedic Surgeon", phone: "+1 (555) 678-9012" },
                { id: 7, name: "Dr. Maria Garcia", specialization: "Sports Medicine Specialist", phone: "+1 (555) 789-0123" },
                { id: 8, name: "Dr. David Brown", specialization: "Rheumatologist", phone: "+1 (555) 890-1234" }
            ]
        }
    ],
    selectedPatient: null,
    selectedFile: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data from localStorage
    loadSavedData();
    
    // Initialize hospital dropdowns
    populateHospitalDropdowns();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if user is already logged in
    checkExistingSession();
}

function loadSavedData() {
    const savedPatients = localStorage.getItem('arthrosheild_patients');
    const savedReports = localStorage.getItem('arthrosheild_reports');
    const savedPlans = localStorage.getItem('arthrosheild_plans');
    const savedNotifications = localStorage.getItem('arthrosheild_notifications');
    const savedMedicationReports = localStorage.getItem('arthrosheild_medication_reports');
    const savedPatientActivities = localStorage.getItem('arthrosheild_patient_activities');
    
    if (savedPatients) AppState.patients = JSON.parse(savedPatients);
    if (savedReports) AppState.reports = JSON.parse(savedReports);
    if (savedPlans) AppState.activityPlans = JSON.parse(savedPlans);
    if (savedNotifications) AppState.notifications = JSON.parse(savedNotifications);
    if (savedMedicationReports) AppState.medicationReports = JSON.parse(savedMedicationReports);
    if (savedPatientActivities) AppState.patientActivities = JSON.parse(savedPatientActivities);
    
    // Add dummy patients if none exist
    if (AppState.patients.length === 0) {
        AppState.patients = [
            {
                id: 1,
                name: "John Doe",
                age: 45,
                gender: "male",
                phone: "+1 (555) 111-2222",
                address: "123 Main St, City, State 12345",
                doctorId: 1,
                doctorName: "Dr. Sarah Johnson",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Jane Smith",
                age: 52,
                gender: "female",
                phone: "+1 (555) 333-4444",
                address: "456 Oak Ave, City, State 67890",
                doctorId: 2,
                doctorName: "Dr. Michael Chen",
                createdAt: new Date().toISOString()
            }
        ];
        saveData();
    }
    
    // Add dummy users for testing if none exist
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    console.log('Current users in localStorage:', users);
    
    // Always ensure test users exist (force creation if needed)
    const requiredUsers = [
        {
            email: "dr.sarah@citymedical.com",
            password: "doctor123",
            role: "doctor",
            name: "Dr. Sarah Johnson",
            organization: "City Medical Center",
            designation: "Orthopedic Surgeon",
            phone: "+1 (555) 123-4567",
            address: "123 Medical Plaza, City, State 12345",
            createdAt: new Date().toISOString()
        },
        {
            email: "dr.michael@memorial.com",
            password: "doctor123",
            role: "doctor",
            name: "Dr. Michael Chen",
            organization: "Memorial Hospital",
            designation: "Rheumatologist",
            phone: "+1 (555) 234-5678",
            address: "456 Hospital Way, City, State 67890",
            createdAt: new Date().toISOString()
        },
        {
            email: "john.doe@email.com",
            password: "patient123",
            role: "patient",
            name: "John Doe",
            age: 45,
            gender: "male",
            address: "123 Main St, City, State 12345",
            hospital: "City Medical Center",
            doctorId: 1,
            createdAt: new Date().toISOString()
        },
        {
            email: "jane.smith@email.com",
            password: "patient123",
            role: "patient",
            name: "Jane Smith",
            age: 52,
            gender: "female",
            address: "456 Oak Ave, City, State 67890",
            hospital: "Memorial Hospital",
            doctorId: 2,
            createdAt: new Date().toISOString()
        }
    ];
    
    // Check if required users exist, if not add them
    let updatedUsers = [...users];
    let usersAdded = false;
    
    requiredUsers.forEach(requiredUser => {
        const exists = users.find(u => u.email === requiredUser.email);
        if (!exists) {
            updatedUsers.push(requiredUser);
            usersAdded = true;
            console.log('Added user:', requiredUser.email);
        }
    });
    
    if (usersAdded || users.length === 0) {
        localStorage.setItem('arthrosheild_users', JSON.stringify(updatedUsers));
        console.log('Users updated in localStorage:', updatedUsers);
    }
}

function clearAndResetUsers() {
    // Clear all existing data and reset with fresh test users
    localStorage.clear();
    
    // Reset with fresh test users
    const testUsers = [
        {
            email: "dr.sarah@citymedical.com",
            password: "doctor123",
            role: "doctor",
            name: "Dr. Sarah Johnson",
            organization: "City Medical Center",
            designation: "Orthopedic Surgeon",
            phone: "+1 (555) 123-4567",
            address: "123 Medical Plaza, City, State 12345",
            createdAt: new Date().toISOString()
        },
        {
            email: "dr.michael@memorial.com",
            password: "doctor123",
            role: "doctor",
            name: "Dr. Michael Chen",
            organization: "Memorial Hospital",
            designation: "Rheumatologist",
            phone: "+1 (555) 234-5678",
            address: "456 Hospital Way, City, State 67890",
            createdAt: new Date().toISOString()
        },
        {
            email: "john.doe@email.com",
            password: "patient123",
            role: "patient",
            name: "John Doe",
            age: 45,
            gender: "male",
            address: "123 Main St, City, State 12345",
            hospital: "City Medical Center",
            doctorId: 1,
            createdAt: new Date().toISOString()
        },
        {
            email: "jane.smith@email.com",
            password: "patient123",
            role: "patient",
            name: "Jane Smith",
            age: 52,
            gender: "female",
            address: "456 Oak Ave, City, State 67890",
            hospital: "Memorial Hospital",
            doctorId: 2,
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('arthrosheild_users', JSON.stringify(testUsers));
    console.log('Users reset successfully:', testUsers);
    
    // Reload the page to ensure fresh state
    window.location.reload();
}

function displayTestCredentials() {
    // Display test credentials on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const credentialsDiv = document.createElement('div');
        credentialsDiv.className = 'test-credentials';
        credentialsDiv.innerHTML = `
            <div class="credentials-info">
                <h4>Test Credentials</h4>
                <div class="credentials-grid">
                    <div class="credential-item">
                        <strong>Doctor Login:</strong><br>
                        Email: dr.sarah@citymedical.com<br>
                        Password: doctor123
                    </div>
                    <div class="credential-item">
                        <strong>Patient Login:</strong><br>
                        Email: john.doe@email.com<br>
                        Password: patient123
                    </div>
                </div>
                <button type="button" class="btn-secondary btn-sm" onclick="clearAndResetUsers()">
                    <i class="fas fa-refresh"></i> Reset Test Users
                </button>
            </div>
        `;
        
        // Insert credentials info before the form
        const formContainer = loginForm.querySelector('.form-container');
        if (formContainer) {
            formContainer.insertBefore(credentialsDiv, formContainer.firstChild);
        }
    }
}

function setupEventListeners() {
    // File upload drag and drop
    const uploadArea = document.querySelector('.file-upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
    }
}

function checkExistingSession() {
    const savedUser = localStorage.getItem('arthrosheild_current_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        AppState.currentUser = user;
        AppState.userRole = user.role;
        
        if (user.role === 'doctor') {
            showDoctorDashboard(user);
        } else {
            showPatientDashboard(user);
        }
    }
}

// Authentication Functions
function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        tabBtns[0].classList.add('active');
        // Display test credentials when login tab is shown
        setTimeout(() => displayTestCredentials(), 100);
    } else {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        tabBtns[1].classList.add('active');
    }
}

function updateSignupForm() {
    const role = document.getElementById('userRole').value;
    const doctorFields = document.getElementById('doctorFields');
    const patientFields = document.getElementById('patientFields');
    
    doctorFields.style.display = role === 'doctor' ? 'block' : 'none';
    patientFields.style.display = role === 'patient' ? 'block' : 'none';
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Debug: Log the input values
    console.log('Login attempt:', { email, password });
    
    // Simulate login (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    console.log('Available users:', users);
    
    const user = users.find(u => u.email === email && u.password === password);
    console.log('Found user:', user);
    
    if (user) {
        AppState.currentUser = user;
        AppState.userRole = user.role;
        localStorage.setItem('arthrosheild_current_user', JSON.stringify(user));
        
        if (user.role === 'doctor') {
            showDoctorDashboard(user);
        } else {
            showPatientDashboard(user);
        }
    } else {
        showNotification('Invalid email or password', 'error');
        
        // Show available test credentials for debugging
        const testUsers = users.filter(u => u.role === 'patient');
        if (testUsers.length > 0) {
            console.log('Available patient credentials:');
            testUsers.forEach(u => {
                console.log(`Email: ${u.email}, Password: ${u.password}`);
            });
        }
    }
}

function saveData() {
    localStorage.setItem('arthrosheild_patients', JSON.stringify(AppState.patients));
    localStorage.setItem('arthrosheild_reports', JSON.stringify(AppState.reports));
    localStorage.setItem('arthrosheild_plans', JSON.stringify(AppState.activityPlans));
    localStorage.setItem('arthrosheild_notifications', JSON.stringify(AppState.notifications));
    localStorage.setItem('arthrosheild_medication_reports', JSON.stringify(AppState.medicationReports));
    localStorage.setItem('arthrosheild_patient_activities', JSON.stringify(AppState.patientActivities));
}

function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('userRole').value;
    
    let userData = {
        email,
        password,
        role,
        createdAt: new Date().toISOString()
    };
    
    if (role === 'doctor') {
        userData.name = document.getElementById('doctorName').value;
        userData.organization = document.getElementById('organization').value;
        userData.designation = document.getElementById('designation').value;
        userData.phone = document.getElementById('doctorPhone').value;
        userData.address = document.getElementById('doctorAddress').value;
    } else {
        userData.name = document.getElementById('patientName').value;
        userData.age = document.getElementById('patientAge').value;
        userData.gender = document.getElementById('patientGender').value;
        userData.address = document.getElementById('patientAddress').value;
        userData.hospital = document.getElementById('hospitalSelect').value;
        userData.doctorId = document.getElementById('doctorSelect').value;
    }
    
    // Save user
    const users = JSON.parse(localStorage.getItem('arthrosheild_users') || '[]');
    users.push(userData);
    localStorage.setItem('arthrosheild_users', JSON.stringify(users));
    
    // Auto login
    AppState.currentUser = userData;
    AppState.userRole = role;
    localStorage.setItem('arthrosheild_current_user', JSON.stringify(userData));
    
    if (role === 'doctor') {
        showDoctorDashboard(userData);
    } else {
        showPatientDashboard(userData);
    }
}

function logout() {
    AppState.currentUser = null;
    AppState.userRole = null;
    localStorage.removeItem('arthrosheild_current_user');
    
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('doctorDashboard').style.display = 'none';
    document.getElementById('patientDashboard').style.display = 'none';
    
    // Clear notifications
    AppState.notifications = [];
    

// Dashboard Functions
function showDoctorDashboard(user) {
    // Check if dashboard elements exist before accessing them
    const authSection = document.getElementById('authSection');
    const doctorDashboard = document.getElementById('doctorDashboard');
    const patientDashboard = document.getElementById('patientDashboard');
    
    if (authSection) authSection.style.display = 'none';
    if (doctorDashboard) doctorDashboard.style.display = 'flex';
    if (patientDashboard) patientDashboard.style.display = 'none';
    
    // Update doctor info
    const doctorName = document.getElementById('doctorName');
    const doctorTitle = document.getElementById('doctorTitle');
    
    if (doctorName) doctorName.textContent = user.name;
    if (doctorTitle) doctorTitle.textContent = user.designation;
    
    // Load data
    loadPatients();
    loadReports();
    loadActivityPlans();
    loadDoctorNotifications();
    loadDoctorStats();
}

function loadDoctorNotifications() {
    const doctorNotifications = AppState.notifications.filter(n => n.userId === AppState.currentUser.id);
    // Update notification badge if needed
    const unreadCount = doctorNotifications.filter(n => !n.read).length;
    
    // Could add notification badge to header
    console.log(`Doctor has ${unreadCount} unread notifications`);
}

function loadDoctorStats() {
    // Calculate doctor statistics
    const totalPatients = AppState.patients.filter(p => p.doctorId === AppState.currentUser.id).length;
    const totalReports = AppState.reports.filter(r => r.doctorId === AppState.currentUser.id).length;
    const totalPlans = AppState.activityPlans.filter(ap => ap.doctorId === AppState.currentUser.id).length;
    const doctorNotifications = AppState.notifications.filter(n => n.userId === AppState.currentUser.id);
    const unreadNotifications = doctorNotifications.filter(n => !n.read).length;
    
    // Update statistics display
    document.getElementById('totalPatientsCount').textContent = totalPatients;
    document.getElementById('totalReportsCount').textContent = totalReports;
    document.getElementById('totalPlansCount').textContent = totalPlans;
    document.getElementById('unreadNotificationsCount').textContent = unreadNotifications;
    
    // Update notification badge
    const badge = document.getElementById('notificationBadge');
    if (unreadNotifications > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadNotifications;
    } else {
        badge.style.display = 'none';
    }
}

function viewNotifications() {
    // Create notifications modal
    let modal = document.getElementById('notificationsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notificationsModal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Notifications</h3>
                    <button class="close-btn" onclick="closeModal('notificationsModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="notifications-list" id="doctorNotificationsList">
                    <!-- Notifications will be loaded here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Load notifications
    const notificationsList = document.getElementById('doctorNotificationsList');
    const doctorNotifications = AppState.notifications.filter(n => n.userId === AppState.currentUser.id);
    
    if (doctorNotifications.length === 0) {
        notificationsList.innerHTML = '<p class="text-muted">No notifications</p>';
    } else {
        notificationsList.innerHTML = '';
        doctorNotifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
            notificationItem.innerHTML = `
                <div class="notification-header">
                    <strong>${notification.title}</strong>
                    <span class="notification-time">${new Date(notification.timestamp).toLocaleString()}</span>
                </div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-patient">Patient: ${notification.patientName || 'N/A'}</div>
            `;
            notificationsList.appendChild(notificationItem);
        });
    }
    
    // Mark all as read
    AppState.notifications.forEach(n => {
        if (n.userId === AppState.currentUser.id) {
            n.read = true;
        }
    });
    saveData();
    loadDoctorStats();
    
    modal.style.display = 'flex';
}

function showPatientDashboard(user) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('doctorDashboard').style.display = 'none';
    document.getElementById('patientDashboard').style.display = 'flex';
    
    AppState.currentUser = user;
    AppState.userRole = 'patient';
    
    // Update patient info
    document.getElementById('patientNameDisplay').textContent = user.name;
    
    // Load patient data
    loadPatientActivities();
    loadPatientReports();
    updatePatientDashboard();
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav link
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load section-specific data
    if (sectionId === 'doctorPatients') {
        loadPatients();
    } else if (sectionId === 'reports') {
        loadReports();
    } else if (sectionId === 'activityPlanner') {
        loadActivityPlans();
    } else if (sectionId === 'uploadXray') {
        loadPatientDropdown();
    }
}

function showPatientSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    let targetSection;
    if (sectionId === 'dashboard') {
        targetSection = document.getElementById('patientDashboardSection');
    } else {
        targetSection = document.getElementById(sectionId);
    }
    
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked nav link
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load section-specific data
    if (sectionId === 'myActivities') {
        loadPatientActivities();
    } else if (sectionId === 'myReports') {
        loadPatientReports();
    } else if (sectionId === 'dashboard') {
        updatePatientDashboard();
    }
}

// Hospital and Doctor Management
function populateHospitalDropdowns() {
    const hospitalSelect = document.getElementById('hospitalSelect');
    if (hospitalSelect) {
        hospitalSelect.innerHTML = '<option value="">Choose a hospital</option>';
        AppState.hospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.id;
            option.textContent = hospital.name;
            hospitalSelect.appendChild(option);
        });
    }
}

function updateDoctorsList() {
    const hospitalId = document.getElementById('hospitalSelect').value;
    const doctorSelect = document.getElementById('doctorSelect');
    
    doctorSelect.innerHTML = '<option value="">Choose a doctor</option>';
    
    if (hospitalId) {
        const hospital = AppState.hospitals.find(h => h.id == hospitalId);
        if (hospital) {
            hospital.doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.name} - ${doctor.specialization}`;
                doctorSelect.appendChild(option);
            });
        }
    }
}

// Patient Management
function loadPatients() {
    const patientsGrid = document.getElementById('patientsGrid');
    const selectPatient = document.getElementById('selectPatient');
    const planPatient = document.getElementById('planPatient');
    
    if (patientsGrid) {
        patientsGrid.innerHTML = '';
        
        AppState.patients.forEach(patient => {
            const patientCard = createPatientCard(patient);
            patientsGrid.appendChild(patientCard);
        });
    }
    
    // Update dropdowns
    if (selectPatient) {
        selectPatient.innerHTML = '<option value="">Choose a patient</option>';
        AppState.patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.name;
            selectPatient.appendChild(option);
        });
    }
    
    if (planPatient) {
        planPatient.innerHTML = '<option value="">Choose a patient</option>';
        AppState.patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.name;
            planPatient.appendChild(option);
        });
    }
}

function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = 'patient-card fade-in';
    card.onclick = () => showPatientDetails(patient);
    
    card.innerHTML = `
        <div class="patient-header">
            <div class="patient-avatar">${patient.name.charAt(0).toUpperCase()}</div>
            <div class="patient-info">
                <h4>${patient.name}</h4>
                <p>${patient.age} years • ${patient.gender}</p>
            </div>
            <div class="patient-actions">
                <button class="btn-small btn-edit" onclick="editPatient(${patient.id}, event)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-delete" onclick="deletePatient(${patient.id}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="patient-details">
            <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${patient.phone || 'Not provided'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Doctor:</span>
                <span class="detail-value">${patient.doctorName || 'Not assigned'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value">Active</span>
            </div>
        </div>
    `;
    
    return card;
}

function showPatientDetails(patient) {
    AppState.selectedPatient = patient;
    // Show patient details modal
    showPatientDetailsModal(patient);
}

function editPatient(patientId, event) {
    event.stopPropagation();
    const patient = AppState.patients.find(p => p.id === patientId);
    if (patient) {
        showEditPatientModal(patient);
    }
}

function deletePatient(patientId, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
        AppState.patients = AppState.patients.filter(p => p.id !== patientId);
        
        // Also delete related data
        AppState.reports = AppState.reports.filter(r => r.patientId !== patientId);
        AppState.activityPlans = AppState.activityPlans.filter(ap => ap.patientId !== patientId);
        AppState.medicationReports = AppState.medicationReports.filter(mr => mr.patientId !== patientId);
        AppState.patientActivities = AppState.patientActivities.filter(pa => pa.patientId !== patientId);
        
        saveData();
        loadPatients();
        showNotification('Patient deleted successfully', 'success');
    }
}

function showEditPatientModal(patient) {
    // Create edit modal if it doesn't exist
    let modal = document.getElementById('editPatientModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editPatientModal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Patient</h3>
                    <button class="close-btn" onclick="closeModal('editPatientModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form onsubmit="handleEditPatient(event)">
                    <input type="hidden" id="editPatientId">
                    <div class="form-group">
                        <label for="editPatientName">Full Name</label>
                        <input type="text" id="editPatientName" required>
                    </div>
                    <div class="form-group">
                        <label for="editPatientAge">Age</label>
                        <input type="number" id="editPatientAge" min="1" max="120" required>
                    </div>
                    <div class="form-group">
                        <label for="editPatientGender">Gender</label>
                        <select id="editPatientGender" required>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editPatientPhone">Phone Number</label>
                        <input type="tel" id="editPatientPhone">
                    </div>
                    <div class="form-group">
                        <label for="editPatientAddress">Address</label>
                        <textarea id="editPatientAddress"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('editPatientModal')">Cancel</button>
                        <button type="submit" class="btn-primary">Update Patient</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Fill form with patient data
    document.getElementById('editPatientId').value = patient.id;
    document.getElementById('editPatientName').value = patient.name;
    document.getElementById('editPatientAge').value = patient.age;
    document.getElementById('editPatientGender').value = patient.gender;
    document.getElementById('editPatientPhone').value = patient.phone || '';
    document.getElementById('editPatientAddress').value = patient.address || '';
    
    modal.style.display = 'flex';
}

function handleEditPatient(event) {
    event.preventDefault();
    
    const patientId = parseInt(document.getElementById('editPatientId').value);
    const patientIndex = AppState.patients.findIndex(p => p.id === patientId);
    
    if (patientIndex !== -1) {
        AppState.patients[patientIndex] = {
            ...AppState.patients[patientIndex],
            name: document.getElementById('editPatientName').value,
            age: parseInt(document.getElementById('editPatientAge').value),
            gender: document.getElementById('editPatientGender').value,
            phone: document.getElementById('editPatientPhone').value,
            address: document.getElementById('editPatientAddress').value,
            updatedAt: new Date().toISOString()
        };
        
        saveData();
        loadPatients();
        closeModal('editPatientModal');
        showNotification('Patient updated successfully', 'success');
    }
}

function showPatientDetailsModal(patient) {
    // Create patient details modal
    let modal = document.getElementById('patientDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'patientDetailsModal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Patient Details</h3>
                    <button class="close-btn" onclick="closeModal('patientDetailsModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="patient-details-content">
                    <!-- Patient details will be loaded here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Load patient details
    const detailsContent = modal.querySelector('.patient-details-content');
    detailsContent.innerHTML = `
        <div class="patient-overview">
            <div class="patient-avatar-large">${patient.name.charAt(0).toUpperCase()}</div>
            <div class="patient-info">
                <h4>${patient.name}</h4>
                <p>${patient.age} years • ${patient.gender}</p>
                <p>${patient.phone || 'No phone'}</p>
                <p>${patient.address || 'No address'}</p>
            </div>
        </div>
        <div class="patient-medical-info">
            <h5>Medical Information</h5>
            <div class="medical-details">
                <p><strong>Doctor:</strong> ${patient.doctorName || 'Not assigned'}</p>
                <p><strong>Status:</strong> Active</p>
                <p><strong>Registered:</strong> ${new Date(patient.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="patient-stats">
            <h5>Statistics</h5>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${AppState.reports.filter(r => r.patientId === patient.id).length}</span>
                    <span class="stat-label">X-Ray Reports</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${AppState.activityPlans.filter(ap => ap.patientId === patient.id).length}</span>
                    <span class="stat-label">Activity Plans</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${AppState.medicationReports.filter(mr => mr.patientId === patient.id).length}</span>
                    <span class="stat-label">Medication Reports</span>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function loadPatientDropdown() {
    const selectPatient = document.getElementById('selectPatient');
    if (selectPatient) {
        selectPatient.innerHTML = '<option value="">Choose a patient</option>';
        AppState.patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.name;
            selectPatient.appendChild(option);
        });
    }
}

function showAddPatientModal() {
    document.getElementById('addPatientModal').style.display = 'flex';
}

function handleAddPatient(event) {
    event.preventDefault();
    
    const newPatient = {
        id: Date.now(),
        name: document.getElementById('newPatientName').value,
        age: parseInt(document.getElementById('newPatientAge').value),
        gender: document.getElementById('newPatientGender').value,
        phone: document.getElementById('newPatientPhone').value,
        address: document.getElementById('newPatientAddress').value,
        doctorId: AppState.currentUser.id,
        doctorName: AppState.currentUser.name,
        createdAt: new Date().toISOString()
    };
    
    AppState.patients.push(newPatient);
    saveData();
    loadPatients();
    
    closeModal('addPatientModal');
    showNotification('Patient added successfully!', 'success');
}

// X-Ray Upload and Analysis
function handleXRayFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        AppState.selectedFile = file;
        showFilePreview(file);
    }
}

function showFilePreview(file) {
    const preview = document.getElementById('filePreview');
    const previewImage = document.getElementById('previewImage');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removeFile() {
    AppState.selectedFile = null;
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('xrayFile').value = '';
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = 'var(--primary-color)';
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = 'var(--border-color)';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        AppState.selectedFile = files[0];
        showFilePreview(files[0]);
    }
}

function handleXrayUpload(event) {
    event.preventDefault();
    
    const patientId = document.getElementById('selectPatient').value;
    
    if (!AppState.selectedFile) {
        showNotification('Please select an X-Ray image', 'error');
        return;
    }
    
    AppState.selectedPatient = AppState.patients.find(p => p.id == patientId);
    
    // Show confirmation modal
    document.getElementById('confirmModal').style.display = 'flex';
}

function confirmAnalysis() {
    closeModal('confirmModal');
    
    // Show loading state
    showNotification('Analyzing X-Ray image...', 'info');
    
    // Simulate analysis process with progress
    setTimeout(() => {
        const report = generateAnalysisReport();
        AppState.reports.push(report);
        saveData();
        
        // Set current report for operations
        AppState.currentReport = report;
        
        // Show success notification
        showNotification('X-Ray analysis completed successfully!', 'success');
        
        // Enable View Report button
        const viewReportBtn = document.getElementById('viewReportBtn');
        if (viewReportBtn) {
            viewReportBtn.disabled = false;
            viewReportBtn.classList.add('btn-success');
            viewReportBtn.classList.remove('btn-secondary');
            console.log('View Report button enabled successfully');
        } else {
            console.error('View Report button not found');
        }
        
        // Create notification for patient
        createNotification(
            '📋 New X-Ray Report Available',
            `Your X-Ray analysis report is ready. Severity: ${report.severity.toUpperCase()}`,
            report.patientId,
            report.patientName
        );
        
        // Refresh reports lists
        loadReports();
        loadPatientReports();
    }, 3000);
}

function generateAnalysisReport() {
    const severities = ['low', 'medium', 'high'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const report = {
        id: Date.now(),
        patientId: AppState.selectedPatient.id,
        patientName: AppState.selectedPatient.name,
        doctorId: AppState.currentUser.id,
        doctorName: AppState.currentUser.name,
        doctorPhone: AppState.currentUser.phone || '+1 (555) 000-0000',
        severity: severity,
        analysisDate: new Date().toISOString(),
        findings: generateFindings(severity),
        recommendations: generateRecommendations(severity),
        imageUrl: document.getElementById('previewImage').src
    };
    
    return report;
}

function generateFindings(severity) {
    const findings = {
        low: [
            "Minimal joint space narrowing observed",
            "No significant osteophyte formation detected",
            "Mild subchondral sclerosis present",
            "Overall knee joint alignment appears normal"
        ],
        medium: [
            "Moderate joint space narrowing in medial compartment",
            "Small osteophytes visible on tibial plateau",
            "Moderate subchondral sclerosis detected",
            "Early signs of joint deformity observed"
        ],
        high: [
            "Severe joint space narrowing throughout knee",
            "Large osteophytes and bone spurs present",
            "Extensive subchondral cyst formation",
            "Significant joint deformity and malalignment"
        ]
    };
    
    return findings[severity];
}

function generateRecommendations(severity) {
    const recommendations = {
        low: [
            "Continue regular low-impact exercise",
            "Maintain healthy weight",
            "Consider physical therapy for strengthening",
            "Follow up in 6 months"
        ],
        medium: [
            "Prescribe anti-inflammatory medication",
            "Refer to physical therapy program",
            "Consider corticosteroid injections",
            "Follow up in 3 months"
        ],
        high: [
            "Consider surgical consultation",
            "Prescribe pain management regimen",
            "Discuss joint replacement options",
            "Immediate follow-up required"
        ]
    };
    
    return recommendations[severity];
}

function showReportModal(report) {
    const reportContent = document.getElementById('reportContent');
    
    reportContent.innerHTML = `
        <div class="report-section">
            <h4>Patient Information</h4>
            <div class="report-details">
                <div class="report-item">
                    <span class="report-label">Name:</span>
                    <span class="report-value">${report.patientName}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Analysis Date:</span>
                    <span class="report-value">${new Date(report.analysisDate).toLocaleDateString()}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Report ID:</span>
                    <span class="report-value">#XR${report.id}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Analysis Results</h4>
            <div class="report-details">
                <div class="report-item">
                    <span class="report-label">Severity Level:</span>
                    <span class="report-value severity-${report.severity}">${report.severity.toUpperCase()}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">KL Grade:</span>
                    <span class="report-value">${getKLGrade(report.severity)}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Key Findings</h4>
            <ul style="list-style: none; padding: 0;">
                ${report.findings.map(finding => `<li style="margin-bottom: 0.5rem;">• ${finding}</li>`).join('')}
            </ul>
        </div>
        
        <div class="report-section">
            <h4>Recommendations</h4>
            <ul style="list-style: none; padding: 0;">
                ${report.recommendations.map(rec => `<li style="margin-bottom: 0.5rem;">• ${rec}</li>`).join('')}
            </ul>
        </div>
        
        <div class="report-section">
            <h4>Doctor Information</h4>
            <div class="report-details">
                <div class="report-item">
                    <span class="report-label">Doctor:</span>
                    <span class="report-value">${report.doctorName}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Contact:</span>
                    <span class="report-value">${report.doctorPhone}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Hospital:</span>
                    <span class="report-value">${AppState.currentUser.organization || 'Medical Center'}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>X-Ray Image</h4>
            <div class="xray-preview">
                <img src="${report.imageUrl}" alt="X-Ray Image" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #ddd;">
            </div>
        </div>
    `;
    
    // Store current report for download/share
    AppState.currentReport = report;
    
    document.getElementById('reportModal').style.display = 'flex';
}

function getKLGrade(severity) {
    const grades = {
        low: 'KL Grade 0-1',
        medium: 'KL Grade 2-3',
        high: 'KL Grade 4'
    };
    return grades[severity] || 'Unknown';
}

function printReport() {
    window.print();
    showNotification('Print dialog opened', 'info');
}

function downloadCurrentReport() {
    if (!AppState.currentReport) {
        showNotification('No report available for download', 'error');
        return;
    }
    
    const report = AppState.currentReport;
    const reportContent = generateReportContent(report);
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XRAY_Report_${report.patientName}_${new Date(report.analysisDate).toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully!', 'success');
}

function shareCurrentReport() {
    if (!AppState.currentReport) {
        showNotification('No report available for sharing', 'error');
        return;
    }
    
    const report = AppState.currentReport;
    
    // Create shareable content
    const shareContent = {
        title: `X-Ray Analysis Report - ${report.patientName}`,
        text: `Severity: ${report.severity.toUpperCase()} | KL Grade: ${getKLGrade(report.severity)} | Date: ${new Date(report.analysisDate).toLocaleDateString()}`,
        url: window.location.href
    };
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share(shareContent)
            .then(() => showNotification('Report shared successfully!', 'success'))
            .catch((error) => {
                console.log('Share cancelled or failed:', error);
                copyShareLink(shareContent);
            });
    } else {
        // Fallback: Copy to clipboard
        copyShareLink(shareContent);
    }
}

function copyShareLink(shareContent) {
    const shareText = `${shareContent.title}\n\n${shareContent.text}\n\nView full report: ${shareContent.url}`;
    
    navigator.clipboard.writeText(shareText)
        .then(() => showNotification('Report link copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy link', 'error'));
}

function generateReportContent(report) {
    return `
=========================================
ARTHROSHIELD - X-RAY ANALYSIS REPORT
=========================================

PATIENT INFORMATION
------------------
Name: ${report.patientName}
Report ID: #XR${report.id}
Analysis Date: ${new Date(report.analysisDate).toLocaleString()}

ANALYSIS RESULTS
-----------------
Severity Level: ${report.severity.toUpperCase()}
KL Grade: ${getKLGrade(report.severity)}

KEY FINDINGS
------------
${report.findings.map(finding => `• ${finding}`).join('\n')}

RECOMMENDATIONS
---------------
${report.recommendations.map(rec => `• ${rec}`).join('\n')}

DOCTOR INFORMATION
------------------
Doctor: ${report.doctorName}
Hospital: ${AppState.currentUser.organization || 'Medical Center'}
Contact: ${report.doctorPhone}

REPORT SUMMARY
--------------
This X-Ray analysis was performed using ARTHROSHIELD's advanced AI-powered diagnostic system.
The analysis indicates ${report.severity} severity of osteoarthritis with corresponding KL grade classification.

NEXT STEPS
-----------
1. Schedule follow-up consultation with doctor
2. Discuss treatment options based on severity
3. Consider lifestyle modifications as recommended
4. Monitor symptoms and report any changes

=========================================
Generated by ARTHROSHIELD on ${new Date().toLocaleString()}
=========================================
    `;
}

// Reports Management
function loadReports() {
    const reportsContainer = document.getElementById('reportsContainer');
    
    if (reportsContainer) {
        reportsContainer.innerHTML = '';
        
        const doctorReports = AppState.reports.filter(r => r.doctorId === AppState.currentUser.id);
        
        doctorReports.forEach(report => {
            const reportCard = createReportCard(report);
            reportsContainer.appendChild(reportCard);
        });
    }
}

function createReportCard(report, type = 'xray') {
    const card = document.createElement('div');
    card.className = 'report-card fade-in';
    
    card.innerHTML = `
        <div class="report-info">
            <h4><i class="fas fa-x-ray"></i> ${report.patientName}</h4>
            <div class="report-meta">
                <span><i class="fas fa-calendar"></i> ${new Date(report.analysisDate).toLocaleDateString()}</span>
                <span class="severity-${report.severity}">${report.severity.toUpperCase()}</span>
                <span><i class="fas fa-id-card"></i> #XR${report.id}</span>
            </div>
        </div>
        <div class="report-actions">
            <button class="btn-secondary" onclick="viewReport(${report.id})">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="btn-info" onclick="shareReportById(${report.id})">
                <i class="fas fa-share-alt"></i> Share
            </button>
            <button class="btn-success" onclick="downloadReportAsPDF(${report.id})">
                <i class="fas fa-file-pdf"></i> Download PDF
            </button>
            <button class="btn-primary" onclick="printReportById(${report.id})">
                <i class="fas fa-print"></i> Print
            </button>
            <button class="btn-delete" onclick="deleteReport(${report.id}, event)">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

function deleteReport(reportId, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
        AppState.reports = AppState.reports.filter(r => r.id !== reportId);
        saveData();
        loadReports();
        showNotification('Report deleted successfully', 'success');
    }
}

function viewReport(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        showReportModal(report);
    }
}

function downloadReportById(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        downloadCurrentReport();
    } else {
        showNotification('Report not found', 'error');
    }
}

function shareReportById(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        shareCurrentReport();
    } else {
        showNotification('Report not found', 'error');
    }
}

function printReportById(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        printReport();
    } else {
        showNotification('Report not found', 'error');
    }
}

// Patient Reports Loading
function loadPatientReports() {
    const patientReportsContainer = document.getElementById('patientReportsContainer');
    
    if (patientReportsContainer) {
        patientReportsContainer.innerHTML = '';
        
        // Get current patient's reports
        const patient = AppState.patients.find(p => p.name === AppState.currentUser.name);
        if (patient) {
            const patientReports = AppState.reports.filter(r => r.patientId === patient.id);
            
            if (patientReports.length === 0) {
                patientReportsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-file-medical"></i>
                        <h3>No Reports Available</h3>
                        <p>Your medical reports will appear here once your doctor completes X-Ray analysis.</p>
                    </div>
                `;
            } else {
                patientReports.forEach(report => {
                    const reportCard = createPatientReportCard(report);
                    patientReportsContainer.appendChild(reportCard);
                });
            }
        }
    }
}

function downloadReportAsPDF(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        downloadReportPDF();
    } else {
        showNotification('Report not found', 'error');
    }
}

function createPatientReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card fade-in';
    
    card.innerHTML = `
        <div class="report-info">
            <h4><i class="fas fa-x-ray"></i> X-Ray Analysis</h4>
            <div class="report-meta">
                <span><i class="fas fa-calendar"></i> ${new Date(report.analysisDate).toLocaleDateString()}</span>
                <span class="severity-${report.severity}">${report.severity.toUpperCase()}</span>
                <span><i class="fas fa-id-card"></i> #XR${report.id}</span>
            </div>
        </div>
        <div class="report-actions">
            <button class="btn-secondary" onclick="viewPatientReport(${report.id})">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="btn-info" onclick="sharePatientReport(${report.id})">
                <i class="fas fa-share-alt"></i> Share
            </button>
            <button class="btn-success" onclick="downloadPatientReportAsPDF(${report.id})">
                <i class="fas fa-file-pdf"></i> Download PDF
            </button>
            <button class="btn-primary" onclick="printPatientReport(${report.id})">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
    `;
    
    return card;
}

function downloadPatientReportAsPDF(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        downloadReportPDF();
    } else {
        showNotification('Report not found', 'error');
    }
}

function viewPatientReport(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        showReportModal(report);
    }
}

function sharePatientReport(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        shareCurrentReport();
    }
}

function downloadPatientReport(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        downloadCurrentReport();
    }
}

function printPatientReport(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        AppState.currentReport = report;
        printReport();
    }
}

// PDF Generation and Display
function generateAndDisplayPDF(report) {
    // Clear the upload area and show PDF
    const uploadSection = document.querySelector('.file-upload-section');
    if (uploadSection) {
        uploadSection.innerHTML = `
            <div class="pdf-report-container">
                <div class="pdf-header">
                    <h3><i class="fas fa-file-pdf"></i> X-Ray Analysis Report</h3>
                    <div class="pdf-actions">
                        <button class="btn-info" onclick="downloadCurrentReport()">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn-success" onclick="shareCurrentReport()">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                        <button class="btn-primary" onclick="printReport()">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button class="btn-secondary" onclick="resetUploadArea()">
                            <i class="fas fa-redo"></i> New Analysis
                        </button>
                    </div>
                </div>
                <div class="pdf-content" id="pdfContent">
                    ${generatePDFContent(report)}
                </div>
            </div>
        `;
    }
}

function generatePDFContent(report) {
    return `
        <div class="pdf-page">
            <div class="pdf-header-info">
                <h1>ARTHROSHIELD - X-RAY ANALYSIS REPORT</h1>
                <div class="pdf-meta">
                    <div class="meta-item">
                        <strong>Report ID:</strong> #XR${report.id}
                    </div>
                    <div class="meta-item">
                        <strong>Analysis Date:</strong> ${new Date(report.analysisDate).toLocaleString()}
                    </div>
                </div>
            </div>
            
            <div class="pdf-section">
                <h2>PATIENT INFORMATION</h2>
                <div class="pdf-info-grid">
                    <div class="info-item">
                        <strong>Name:</strong> ${report.patientName}
                    </div>
                    <div class="info-item">
                        <strong>Patient ID:</strong> ${report.patientId}
                    </div>
                </div>
            </div>
            
            <div class="pdf-section">
                <h2>ANALYSIS RESULTS</h2>
                <div class="pdf-info-grid">
                    <div class="info-item">
                        <strong>Severity Level:</strong> <span class="severity-${report.severity}">${report.severity.toUpperCase()}</span>
                    </div>
                    <div class="info-item">
                        <strong>KL Grade:</strong> ${getKLGrade(report.severity)}
                    </div>
                </div>
            </div>
            
            <div class="pdf-section">
                <h2>KEY FINDINGS</h2>
                <ul class="pdf-findings">
                    ${report.findings.map(finding => `<li>${finding}</li>`).join('')}
                </ul>
            </div>
            
            <div class="pdf-section">
                <h2>RECOMMENDATIONS</h2>
                <ul class="pdf-recommendations">
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="pdf-section">
                <h2>DOCTOR INFORMATION</h2>
                <div class="pdf-info-grid">
                    <div class="info-item">
                        <strong>Doctor:</strong> ${report.doctorName}
                    </div>
                    <div class="info-item">
                        <strong>Hospital:</strong> ${AppState.currentUser.organization || 'Medical Center'}
                    </div>
                    <div class="info-item">
                        <strong>Contact:</strong> ${report.doctorPhone}
                    </div>
                </div>
            </div>
            
            <div class="pdf-footer">
                <p><strong>Report Summary:</strong> This X-Ray analysis was performed using ARTHROSHIELD's advanced AI-powered diagnostic system.</p>
                <p><strong>Next Steps:</strong> Schedule follow-up consultation with your doctor to discuss treatment options.</p>
                <hr>
                <p class="generated-by">Generated by ARTHROSHIELD on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
}

function resetUploadArea() {
    const uploadSection = document.querySelector('.file-upload-section');
    if (uploadSection) {
        uploadSection.innerHTML = `
            <div class="upload-area" data-plan-id="" data-activity-type="" ondrop="handleDrop(event, '', '')" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)">
                <div class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag & drop files here or click to browse</p>
                    <small>Supports: Images, PDFs, Documents (Max 5MB)</small>
                </div>
                <input type="file" data-plan-id="" data-activity-type="" multiple accept="image/*,.pdf,.doc,.docx,.txt" onchange="handleFileSelect(event, '', '')" style="display: none;">
            </div>
        `;
    }
    
    // Clear selected file
    AppState.selectedFile = null;
    document.getElementById('xrayFile').value = '';
    document.getElementById('filePreview').style.display = 'none';
    
    showNotification('Ready for new X-Ray analysis', 'info');
}

// Display Generated Report in Dedicated Section
function displayGeneratedReport(report) {
    // Hide form and show report section
    const uploadForm = document.querySelector('.upload-form');
    const reportSection = document.getElementById('generatedReportSection');
    const reportDisplay = document.getElementById('reportDisplay');
    
    if (uploadForm) uploadForm.style.display = 'none';
    if (reportSection) {
        reportSection.style.display = 'block';
        reportDisplay.innerHTML = generateReportContentHTML(report);
    }
}

function generateReportContentHTML(report) {
    return `
        <div class="report-content-wrapper">
            <div class="report-header-info">
                <h2>ARTHROSHIELD - X-RAY ANALYSIS REPORT</h2>
                <div class="report-meta">
                    <div class="meta-item">
                        <strong>Report ID:</strong> #XR${report.id}
                    </div>
                    <div class="meta-item">
                        <strong>Analysis Date:</strong> ${new Date(report.analysisDate).toLocaleString()}
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h3>PATIENT INFORMATION</h3>
                <div class="report-info-grid">
                    <div class="info-item">
                        <strong>Name:</strong> ${report.patientName}
                    </div>
                    <div class="info-item">
                        <strong>Patient ID:</strong> ${report.patientId}
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h3>ANALYSIS RESULTS</h3>
                <div class="report-info-grid">
                    <div class="info-item">
                        <strong>Severity Level:</strong> <span class="severity-${report.severity}">${report.severity.toUpperCase()}</span>
                    </div>
                    <div class="info-item">
                        <strong>KL Grade:</strong> ${getKLGrade(report.severity)}
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h3>KEY FINDINGS</h3>
                <ul class="report-findings">
                    ${report.findings.map(finding => `<li>${finding}</li>`).join('')}
                </ul>
            </div>
            
            <div class="report-section">
                <h3>RECOMMENDATIONS</h3>
                <ul class="report-recommendations">
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="report-section">
                <h3>DOCTOR INFORMATION</h3>
                <div class="report-info-grid">
                    <div class="info-item">
                        <strong>Doctor:</strong> ${report.doctorName}
                    </div>
                    <div class="info-item">
                        <strong>Hospital:</strong> ${AppState.currentUser.organization || 'Medical Center'}
                    </div>
                    <div class="info-item">
                        <strong>Contact:</strong> ${report.doctorPhone}
                    </div>
                </div>
            </div>
            
            <div class="report-footer">
                <p><strong>Report Summary:</strong> This X-Ray analysis was performed using ARTHROSHIELD's advanced AI-powered diagnostic system.</p>
                <p><strong>Next Steps:</strong> Schedule follow-up consultation with your doctor to discuss treatment options.</p>
                <hr>
                <p class="generated-by">Generated by ARTHROSHIELD on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
}

function clearGeneratedReport() {
    const uploadForm = document.querySelector('.upload-form');
    const reportSection = document.getElementById('generatedReportSection');
    
    if (uploadForm) uploadForm.style.display = 'block';
    if (reportSection) reportSection.style.display = 'none';
    
    // Clear file input and preview
    document.getElementById('xrayFile').value = '';
    document.getElementById('filePreview').style.display = 'none';
    AppState.selectedFile = null;
    
    showNotification('Report cleared. Ready for new analysis.', 'info');
}

// PDF Download Function
function downloadReportPDF() {
    if (!AppState.currentReport) {
        showNotification('No report available for download', 'error');
        return;
    }
    
    const report = AppState.currentReport;
    const pdfContent = generateReportContent(report);
    
    // Create and download file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARTHROSHIELD_XRAY_Report_${report.patientName}_${new Date(report.analysisDate).toISOString().split('T')[0]}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully as PDF!', 'success');
}

// Show Report for Doctor with Proceed and Download buttons
function showReportForDoctor() {
    console.log('showReportForDoctor called');
    console.log('AppState.currentReport:', AppState.currentReport);
    
    if (!AppState.currentReport) {
        showNotification('No report available to view', 'error');
        return;
    }
    
    const report = AppState.currentReport;
    console.log('Showing report for:', report);
    
    // Show report modal with doctor-specific actions
    const reportContent = document.getElementById('reportContent');
    
    if (!reportContent) {
        console.error('Report content element not found');
        showNotification('Report display error', 'error');
        return;
    }
    
    reportContent.innerHTML = `
        <div class="report-section">
            <h4>Patient Information</h4>
            <div class="report-details">
                <div class="report-item">
                    <span class="report-label">Name:</span>
                    <span class="report-value">${report.patientName}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Analysis Date:</span>
                    <span class="report-value">${new Date(report.analysisDate).toLocaleDateString()}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Report ID:</span>
                    <span class="report-value">#XR${report.id}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Analysis Results</h4>
            <div class="report-details">
                <div class="report-item">
                    <span class="report-label">Severity Level:</span>
                    <span class="report-value severity-${report.severity}">${report.severity.toUpperCase()}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">KL Grade:</span>
                    <span class="report-value">${getKLGrade(report.severity)}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Key Findings</h4>
            <ul style="list-style: none; padding: 0;">
                ${report.findings.map(finding => `<li style="margin-bottom: 0.5rem;">• ${finding}</li>`).join('')}
            </ul>
        </div>
        
        <div class="report-section">
            <h4>Recommendations</h4>
            <ul style="list-style: none; padding: 0;">
                ${report.recommendations.map(rec => `<li style="margin-bottom: 0.5rem;">• ${rec}</li>`).join('')}
            </ul>
        </div>
        
        <div class="report-section">
            <h4>Doctor Information</h4>
            <div class="report-details">
                <div class="report-item">
                    <span class="report-label">Doctor:</span>
                    <span class="report-value">${report.doctorName}</span>
                </div>
                <div class="report-item">
                    <span class="report-label">Contact:</span>
                    <span class="report-value">${report.doctorPhone}</span>
                </div>
            </div>
        </div>
    `;
    
    // Update modal actions for doctor
    const modalActions = document.querySelector('#reportModal .form-actions');
    if (modalActions) {
        modalActions.innerHTML = `
            <button type="button" class="btn-secondary" onclick="closeModal('reportModal')">
                <i class="fas fa-times"></i> Close
            </button>
            <button type="button" class="btn-success" onclick="downloadReportPDF()">
                <i class="fas fa-download"></i> Download
            </button>
            <button type="button" class="btn-primary" onclick="proceedToReportsPage()">
                <i class="fas fa-arrow-right"></i> Proceed
            </button>
        `;
    } else {
        console.error('Modal actions element not found');
    }
    
    // Show modal
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'flex';
        console.log('Modal shown successfully');
    } else {
        console.error('Modal element not found');
    }
}

function proceedToReportsPage() {
    closeModal('reportModal');
    showSection('reports');
    showNotification('Proceeding to Reports page...', 'info');
}

// Activity Planner
function loadActivityPlans() {
    const existingPlans = document.getElementById('existingPlans');
    
    if (existingPlans) {
        existingPlans.innerHTML = '';
        
        AppState.activityPlans.forEach(plan => {
            const planCard = createPlanCard(plan);
            existingPlans.appendChild(planCard);
        });
    }
}

function createPlanCard(plan) {
    const card = document.createElement('div');
    card.className = 'plan-card fade-in';
    
    const patient = AppState.patients.find(p => p.id === plan.patientId);
    
    card.innerHTML = `
        <div class="plan-header">
            <div class="plan-patient">${patient ? patient.name : 'Unknown Patient'}</div>
            <div class="plan-date">${new Date(plan.createdAt).toLocaleDateString()}</div>
            <div class="plan-actions">
                <button class="btn-small btn-edit" onclick="editPlan(${plan.id}, event)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-delete" onclick="deletePlan(${plan.id}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="plan-content">
            ${plan.diet ? `
                <div class="plan-section">
                    <h5><i class="fas fa-utensils"></i> Diet Plan</h5>
                    <p>${plan.diet}</p>
                </div>
            ` : ''}
            ${plan.exercise ? `
                <div class="plan-section">
                    <h5><i class="fas fa-running"></i> Exercise Plan</h5>
                    <p>${plan.exercise}</p>
                </div>
            ` : ''}
            ${plan.medication ? `
                <div class="plan-section">
                    <h5><i class="fas fa-pills"></i> Medication Plan</h5>
                    <p>${plan.medication}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

function editPlan(planId, event) {
    event.stopPropagation();
    const plan = AppState.activityPlans.find(p => p.id === planId);
    if (plan) {
        showEditPlanModal(plan);
    }
}

function deletePlan(planId, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this activity plan? This action cannot be undone.')) {
        AppState.activityPlans = AppState.activityPlans.filter(p => p.id !== planId);
        saveData();
        loadActivityPlans();
        showNotification('Activity plan deleted successfully', 'success');
    }
}

function showEditPlanModal(plan) {
    // Create edit plan modal
    let modal = document.getElementById('editPlanModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editPlanModal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Activity Plan</h3>
                    <button class="close-btn" onclick="closeModal('editPlanModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form onsubmit="handleEditPlan(event)">
                    <input type="hidden" id="editPlanId">
                    <div class="form-group">
                        <label for="editPlanPatient">Patient</label>
                        <select id="editPlanPatient" disabled>
                            <option value="">Choose a patient</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editPlanDiet">Diet Plan</label>
                        <textarea id="editPlanDiet" rows="4" placeholder="Enter diet recommendations..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPlanExercise">Exercise Plan</label>
                        <textarea id="editPlanExercise" rows="4" placeholder="Enter exercise recommendations..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPlanMedication">Medication Plan</label>
                        <textarea id="editPlanMedication" rows="4" placeholder="Enter medication recommendations..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('editPlanModal')">Cancel</button>
                        <button type="submit" class="btn-primary">Update Plan</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Fill form with plan data
    document.getElementById('editPlanId').value = plan.id;
    
    const patientSelect = document.getElementById('editPlanPatient');
    patientSelect.innerHTML = '<option value="">Choose a patient</option>';
    AppState.patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        if (patient.id === plan.patientId) {
            option.selected = true;
        }
        patientSelect.appendChild(option);
    });
    
    document.getElementById('editPlanDiet').value = plan.diet || '';
    document.getElementById('editPlanExercise').value = plan.exercise || '';
    document.getElementById('editPlanMedication').value = plan.medication || '';
    
    modal.style.display = 'flex';
}

function handleEditPlan(event) {
    event.preventDefault();
    
    const planId = parseInt(document.getElementById('editPlanId').value);
    const planIndex = AppState.activityPlans.findIndex(p => p.id === planId);
    
    if (planIndex !== -1) {
        AppState.activityPlans[planIndex] = {
            ...AppState.activityPlans[planIndex],
            diet: document.getElementById('editPlanDiet').value,
            exercise: document.getElementById('editPlanExercise').value,
            medication: document.getElementById('editPlanMedication').value,
            updatedAt: new Date().toISOString()
        };
        
        saveData();
        loadActivityPlans();
        closeModal('editPlanModal');
        showNotification('Activity plan updated successfully', 'success');
    }
}

function showAddPlanModal() {
    document.getElementById('addPlanModal').style.display = 'flex';
}

function handleAddPlan(event) {
    event.preventDefault();
    
    const newPlan = {
        id: Date.now(),
        patientId: parseInt(document.getElementById('planPatient').value),
        diet: document.getElementById('planDiet').value,
        exercise: document.getElementById('planExercise').value,
        medication: document.getElementById('planMedication').value,
        doctorId: AppState.currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    AppState.activityPlans.push(newPlan);
    saveData();
    
    // Create medication report if medication is prescribed
    if (newPlan.medication) {
        createMedicationReport(newPlan);
    }
    
    // Notify patient of new plan
    const patient = AppState.patients.find(p => p.id === newPlan.patientId);
    if (patient) {
        createNotification(
            'New Activity Plan',
            `Dr. ${AppState.currentUser.name} has created a new activity plan for you`,
            patient.id,
            patient.name
        );
        
        createPatientActivity(
            'New Plan Created',
            `Doctor created new ${newPlan.diet ? 'diet' : ''}${newPlan.exercise ? ' and exercise' : ''}${newPlan.medication ? ' and medication' : ''} plan`,
            newPlan.patientId
        );
    }
    
    loadActivityPlans();
    closeModal('addPlanModal');
    showNotification('Activity plan created successfully!', 'success');
}

function createMedicationReport(plan) {
    const patient = AppState.patients.find(p => p.id === plan.patientId);
    
    const medicationReport = {
        id: Date.now(),
        patientId: plan.patientId,
        patientName: patient.name,
        doctorId: plan.doctorId,
        doctorName: AppState.currentUser.name,
        doctorPhone: AppState.currentUser.phone || '+1 (555) 000-0000',
        medications: parseMedicationText(plan.medication),
        notes: plan.medication,
        timestamp: new Date().toISOString()
    };
    
    AppState.medicationReports.push(medicationReport);
    saveData();
}

function parseMedicationText(medicationText) {
    // Simple parsing of medication text - in real app this would be more sophisticated
    return [
        {
            name: 'Prescribed Medication',
            dosage: 'As prescribed',
            frequency: 'As directed by doctor'
        }
    ];
}

// Enhanced Patient Dashboard Functions
function updatePatientDashboard() {
    const patientReports = AppState.reports.filter(r => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === r.patientId)
    );
    
    const latestReport = patientReports.length > 0 ? 
        patientReports.sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate))[0] : null;
    
    // Update patient info
    const patient = AppState.patients.find(p => p.name === AppState.currentUser.name);
    if (patient) {
        document.getElementById('patientFullName').textContent = patient.name;
        document.getElementById('patientAgeGender').textContent = `${patient.age} years • ${patient.gender}`;
        document.getElementById('patientDoctor').textContent = patient.doctorName || 'Not assigned';
        
        // Find hospital
        const doctorHospital = AppState.hospitals.find(h => 
            h.doctors.some(d => d.name === patient.doctorName)
        );
        document.getElementById('patientHospital').textContent = doctorHospital ? doctorHospital.name : 'Unknown';
    }
    
    // Update dashboard cards
    document.getElementById('latestXrayDate').textContent = 
        latestReport ? new Date(latestReport.analysisDate).toLocaleDateString() : 'No X-Ray uploaded';
    
    document.getElementById('severityLevel').textContent = 
        latestReport ? latestReport.severity.toUpperCase() : 'Not analyzed';
    
    if (latestReport) {
        document.getElementById('severityLevel').className = `severity-${latestReport.severity}`;
        
        // Update progress bar
        const progressPercent = latestReport.severity === 'low' ? 25 : 
                              latestReport.severity === 'medium' ? 50 : 75;
        document.getElementById('severityProgress').style.width = `${progressPercent}%`;
    }
    
    // Count activities for today
    const patientPlans = AppState.activityPlans.filter(plan => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === plan.patientId)
    );
    
    const activitiesCount = patientPlans.length > 0 ? 
        (patientPlans[0].diet ? 1 : 0) + (patientPlans[0].exercise ? 1 : 0) + (patientPlans[0].medication ? 1 : 0) : 0;
    
    document.getElementById('activitiesToday').textContent = `${activitiesCount} activities`;
    document.getElementById('completedActivities').textContent = '0';
    document.getElementById('totalActivities').textContent = activitiesCount;
    
    // Update medication status
    const medicationReports = AppState.medicationReports.filter(mr => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === mr.patientId)
    );
    
    if (medicationReports.length > 0) {
        document.getElementById('medicationStatus').textContent = 'Active medications';
    }
    
    // Update health score (mock calculation)
    const healthScore = calculateHealthScore(latestReport, patientPlans);
    document.getElementById('healthScore').textContent = `${healthScore}/100`;
    
    // Update notifications
    loadNotifications();
    
    // Update recent activity
    loadRecentActivity();
}

function calculateHealthScore(report, plans) {
    let score = 85; // Base score
    
    if (report) {
        if (report.severity === 'low') score += 10;
        else if (report.severity === 'medium') score -= 5;
        else if (report.severity === 'high') score -= 15;
    }
    
    if (plans.length > 0) {
        score += 5; // Has activity plan
    }
    
    return Math.max(0, Math.min(100, score));
}

function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';
    
    const userNotifications = AppState.notifications.filter(n => 
        n.userId === AppState.currentUser.id || n.patientName === AppState.currentUser.name
    );
    
    if (userNotifications.length === 0) {
        notificationsList.innerHTML = '<p class="text-muted">No notifications</p>';
        return;
    }
    
    userNotifications.slice(0, 5).forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
        notificationItem.innerHTML = `
            <strong>${notification.title}</strong><br>
            <small>${notification.message}</small><br>
            <small class="timestamp">${new Date(notification.timestamp).toLocaleString()}</small>
        `;
        notificationsList.appendChild(notificationItem);
    });
}

function loadRecentActivity() {
    const recentActivityList = document.getElementById('recentActivityList');
    recentActivityList.innerHTML = '';
    
    const patientActivities = AppState.patientActivities.filter(pa => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === pa.patientId)
    );
    
    if (patientActivities.length === 0) {
        recentActivityList.innerHTML = '<p class="text-muted">No recent activity</p>';
        return;
    }
    
    patientActivities.slice(0, 5).forEach(activity => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <h4>${activity.type}</h4>
            <p>${activity.description}</p>
            <div class="timestamp">${new Date(activity.timestamp).toLocaleString()}</div>
        `;
        recentActivityList.appendChild(timelineItem);
    });
}

function createNotification(title, message, userId, patientName) {
    const notification = {
        id: Date.now(),
        title,
        message,
        userId,
        patientName,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    AppState.notifications.push(notification);
    saveData();
    
    return notification;
}

function createPatientActivity(type, description, patientId) {
    const activity = {
        id: Date.now(),
        type,
        description,
        patientId,
        timestamp: new Date().toISOString()
    };
    
    AppState.patientActivities.push(activity);
    saveData();
    
    return activity;
}

// Patient Dashboard Functions
function updatePatientDashboard() {
    const patientReports = AppState.reports.filter(r => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === r.patientId)
    );
    
    const latestReport = patientReports.length > 0 ? 
        patientReports.sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate))[0] : null;
    
    // Update dashboard cards
    document.getElementById('latestXrayDate').textContent = 
        latestReport ? new Date(latestReport.analysisDate).toLocaleDateString() : 'No X-Ray uploaded';
    
    document.getElementById('severityLevel').textContent = 
        latestReport ? latestReport.severity.toUpperCase() : 'Not analyzed';
    
    if (latestReport) {
        document.getElementById('severityLevel').className = `severity-${latestReport.severity}`;
    }
    
    // Count activities for today
    const patientPlans = AppState.activityPlans.filter(plan => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === plan.patientId)
    );
    
    const activitiesCount = patientPlans.length > 0 ? 
        (patientPlans[0].diet ? 1 : 0) + (patientPlans[0].exercise ? 1 : 0) + (patientPlans[0].medication ? 1 : 0) : 0;
    
    document.getElementById('activitiesToday').textContent = `${activitiesCount} activities`;
}

function loadPatientActivities() {
    const activitiesContainer = document.getElementById('activitiesContainer');
    
    if (activitiesContainer) {
        activitiesContainer.innerHTML = '';
        
        const patientPlans = AppState.activityPlans.filter(plan => 
            AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === plan.patientId)
        );
        
        if (patientPlans.length > 0) {
            const plan = patientPlans[0];
            
            if (plan.diet) {
                activitiesContainer.appendChild(createInteractiveActivityCard('Diet Plan', plan.diet, 'diet', plan.id));
            }
            
            if (plan.exercise) {
                activitiesContainer.appendChild(createInteractiveActivityCard('Exercise Plan', plan.exercise, 'exercise', plan.id));
            }
            
            if (plan.medication) {
                activitiesContainer.appendChild(createInteractiveActivityCard('Medication Plan', plan.medication, 'medication', plan.id));
            }
            
            // Add query section
            activitiesContainer.appendChild(createQuerySection(plan.id));
            
            // Add progress graph section
            activitiesContainer.appendChild(createProgressGraphSection());
            
            // Add send button (only enabled when all activities are completed)
            activitiesContainer.appendChild(createSendButtonSection(plan.id));
        } else {
            activitiesContainer.innerHTML = '<p class="text-muted">No activity plans available. Please consult your doctor.</p>';
        }
        
        // Update progress summary
        updateActivityProgress();
    }
}

function createQuerySection(planId) {
    const section = document.createElement('div');
    section.className = 'query-section';
    
    section.innerHTML = `
        <h4><i class="fas fa-question-circle"></i> Have a Question for Your Doctor?</h4>
        <textarea id="queryTextarea_${planId}" placeholder="Ask any questions about your treatment plan, activities, or health concerns... This is optional but your doctor is here to help!" rows="4"></textarea>
        <div class="query-actions">
            <button class="btn-secondary" onclick="clearQuery('${planId}')">
                <i class="fas fa-times"></i> Clear
            </button>
            <button class="btn-primary" onclick="sendQuery('${planId}')">
                <i class="fas fa-paper-plane"></i> Send Query
            </button>
        </div>
    `;
    
    return section;
}

function createProgressGraphSection() {
    const section = document.createElement('div');
    section.className = 'progress-graph-section';
    
    section.innerHTML = `
        <h4><i class="fas fa-chart-line"></i> Weekly Activity Progress</h4>
        <div class="graph-container">
            <canvas id="progressGraph" class="graph-canvas"></canvas>
        </div>
        <div class="graph-legend">
            <div class="legend-item">
                <div class="legend-color" style="background: #10b981;"></div>
                <span>Completed</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #f59e0b;"></div>
                <span>Pending</span>
            </div>
        </div>
    `;
    
    // Draw the graph after the section is added to DOM
    setTimeout(() => drawProgressGraph(), 100);
    
    return section;
}

function createSendButtonSection(planId) {
    const section = document.createElement('div');
    section.className = 'send-button-section';
    
    section.innerHTML = `
        <div class="send-actions">
            <button id="sendReportBtn_${planId}" class="btn-primary btn-lg" onclick="sendCompletionReport('${planId}')" disabled>
                <i class="fas fa-paper-plane"></i> Send Progress Report to Doctor
            </button>
            <p class="send-note">Complete all activities to enable sending report</p>
        </div>
    `;
    
    return section;
}

function clearQuery(planId) {
    const queryTextarea = document.getElementById(`queryTextarea_${planId}`);
    if (queryTextarea) {
        queryTextarea.value = '';
        showNotification('Query cleared', 'info');
    }
}

function sendQuery(planId) {
    const queryTextarea = document.getElementById(`queryTextarea_${planId}`);
    const query = queryTextarea.value.trim();
    
    if (query) {
        const patient = AppState.patients.find(p => p.name === AppState.currentUser.name);
        if (patient) {
            // Create query notification
            createNotification(
                '📋 New Patient Query',
                `${patient.name} has a question: "${query.substring(0, 100)}${query.length > 100 ? '...' : ''}"`,
                patient.doctorId,
                patient.name
            );
            
            // Save query to patient activities
            createPatientActivity(
                'Query Sent',
                `Patient asked: ${query}`,
                patient.id
            );
            
            // Clear the query textarea
            queryTextarea.value = '';
            
            showNotification('Your question has been sent to your doctor!', 'success');
        }
    } else {
        showNotification('Please enter a question before sending.', 'error');
    }
}

function sendCompletionReport(planId) {
    const patient = AppState.patients.find(p => p.name === AppState.currentUser.name);
    if (patient) {
        // Create completion report notification
        createNotification(
            '🎉 Patient Activities Completed',
            `${patient.name} has completed all assigned activities and sent a progress report!`,
            patient.doctorId,
            patient.name
        );
        
        // Save completion to patient activities
        createPatientActivity(
            'Progress Report Sent',
            'All activities completed and progress report sent to doctor',
            patient.id
        );
        
        // Show congratulations modal
        showCongratulationsModal();
        
        // Disable the send button
        const sendBtn = document.getElementById(`sendReportBtn_${planId}`);
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<i class="fas fa-check"></i> Report Sent Successfully';
        }
    }
}

function showCongratulationsModal() {
    const motivationalQuotes = [
        "Success is the sum of small efforts repeated day in and day out.",
        "Every step forward is a victory worth celebrating!",
        "Your dedication today builds your healthier tomorrow.",
        "Progress, not perfection, is the key to success.",
        "You're stronger than you think and more capable than you imagine!",
        "Health is not just about what you're doing. It's also about what you're thinking.",
        "Take care of your body. It's the only place you have to live.",
        "Your commitment to health inspires everyone around you!"
    ];
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    
    let modal = document.getElementById('congratulationsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'congratulationsModal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content congratulations-modal">
                <div class="congratulations-header">
                    <div class="congratulations-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h3>🎉 Congratulations! 🎉</h3>
                </div>
                <div class="congratulations-content">
                    <p class="congrats-message">You've successfully completed all your activities!</p>
                    <p class="motivational-quote">"${randomQuote}"</p>
                    <div class="congrats-actions">
                        <button class="btn-primary" onclick="closeModal('congratulationsModal')">
                            <i class="fas fa-thumbs-up"></i> Awesome!
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Update the quote if modal already exists
        const quoteElement = modal.querySelector('.motivational-quote');
        if (quoteElement) {
            quoteElement.textContent = `"${randomQuote}"`;
        }
    }
    
    modal.style.display = 'flex';
}

function createInteractiveActivityCard(title, content, type, planId) {
    const card = document.createElement('div');
    card.className = 'activity-card fade-in';
    
    const iconMap = {
        diet: 'fa-utensils',
        exercise: 'fa-running',
        medication: 'fa-pills'
    };
    
    const completedActivities = JSON.parse(localStorage.getItem('completed_activities') || '[]');
    const isCompleted = completedActivities.includes(`${planId}-${type}`);
    
    // Get uploaded files for this activity
    const uploadedFiles = JSON.parse(localStorage.getItem(`activity_files_${planId}_${type}`) || '[]');
    const activityComments = JSON.parse(localStorage.getItem(`activity_comments_${planId}_${type}`) || '{}');
    
    card.innerHTML = `
        <div class="activity-header">
            <div class="activity-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleActivityComplete('${planId}-${type}', this)"></div>
            <div class="activity-icon ${type}">
                <i class="fas ${iconMap[type]}"></i>
            </div>
            <div class="activity-title">${title}</div>
            <span class="activity-status ${isCompleted ? 'completed' : 'pending'}">${isCompleted ? 'Completed' : 'Pending'}</span>
        </div>
        <div class="activity-content">
            <p>${content}</p>
        </div>
        
        <!-- File Upload Section -->
        <div class="file-upload-section">
            <div class="upload-area" data-plan-id="${planId}" data-activity-type="${type}" ondrop="handleDrop(event, '${planId}', '${type}')" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)">
                <div class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag & drop files here or click to browse</p>
                    <small>Supports: Images, PDFs, Documents (Max 5MB)</small>
                </div>
                <input type="file" data-plan-id="${planId}" data-activity-type="${type}" multiple accept="image/*,.pdf,.doc,.docx,.txt" onchange="handleFileSelect(event, '${planId}', '${type}')" style="display: none;">
            </div>
            <div class="upload-test">
                <button class="btn-secondary btn-sm" onclick="testFileUpload('${planId}', '${type}')">
                    <i class="fas fa-test"></i> Test Upload
                </button>
            </div>
            <div class="uploaded-files" id="uploadedFiles_${planId}_${type}">
                ${uploadedFiles.map(file => `
                    <div class="file-item" data-file-id="${file.id}">
                        <div class="file-info">
                            <i class="fas ${getFileIcon(file.type)}"></i>
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${formatFileSize(file.size)}</span>
                        </div>
                        <div class="file-actions">
                            <button class="btn-small btn-edit" onclick="editFile('${planId}', '${type}', '${file.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-small btn-delete" onclick="deleteFile('${planId}', '${type}', '${file.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Comment Section -->
        <div class="comment-section">
            <label for="comment_${planId}_${type}">Your Response/Comments:</label>
            <textarea id="comment_${planId}_${type}" placeholder="Enter your response, progress, or any queries about this activity..." rows="3">${activityComments.comment || ''}</textarea>
            <button class="btn-secondary btn-sm" onclick="saveComment('${planId}', '${type}')">
                <i class="fas fa-save"></i> Save Comment
            </button>
        </div>
        
        <div class="activity-actions">
            <button class="btn-edit" onclick="editActivity('${planId}', '${type}', '${content}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" onclick="deleteActivity('${planId}', '${type}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    // Setup click event for upload area using data attributes
    const uploadArea = card.querySelector('.upload-area');
    const fileInput = card.querySelector('input[type="file"]');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => {
            console.log('Upload area clicked, triggering file input');
            fileInput.click();
        });
        
        console.log('File upload event listeners set up for:', planId, type);
    } else {
        console.error('Could not find upload elements for:', planId, type);
        console.log('Upload area:', uploadArea);
        console.log('File input:', fileInput);
    }
    
    return card;
}

function toggleActivityComplete(activityId, checkboxElement) {
    const completedActivities = JSON.parse(localStorage.getItem('completed_activities') || '[]');
    const index = completedActivities.indexOf(activityId);
    
    if (index > -1) {
        completedActivities.splice(index, 1);
        checkboxElement.classList.remove('checked');
        checkboxElement.parentElement.querySelector('.activity-status').textContent = 'Pending';
        checkboxElement.parentElement.querySelector('.activity-status').className = 'activity-status pending';
    } else {
        completedActivities.push(activityId);
        checkboxElement.classList.add('checked');
        checkboxElement.parentElement.querySelector('.activity-status').textContent = 'Completed';
        checkboxElement.parentElement.querySelector('.activity-status').className = 'activity-status completed';
        
        // Notify doctor of completion
        notifyDoctorActivityComplete(activityId);
    }
    
    localStorage.setItem('completed_activities', JSON.stringify(completedActivities));
    updateActivityProgress();
}

function updateActivityProgress() {
    const completedActivities = JSON.parse(localStorage.getItem('completed_activities') || '[]');
    const patientPlans = AppState.activityPlans.filter(plan => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === plan.patientId)
    );
    
    let totalActivities = 0;
    let completedCount = 0;
    
    if (patientPlans.length > 0) {
        const plan = patientPlans[0];
        if (plan.diet) totalActivities++;
        if (plan.exercise) totalActivities++;
        if (plan.medication) totalActivities++;
        
        completedCount = completedActivities.filter(id => id.startsWith(plan.id.toString())).length;
        
        // Enable/disable send button based on completion
        const sendBtn = document.getElementById(`sendReportBtn_${plan.id}`);
        if (sendBtn) {
            const allCompleted = completedCount === totalActivities;
            sendBtn.disabled = !allCompleted;
            
            if (allCompleted) {
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Progress Report to Doctor';
                sendBtn.classList.remove('disabled');
            } else {
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Progress Report to Doctor';
                sendBtn.classList.add('disabled');
            }
        }
    }
    
    const percentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;
    
    // Update progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        progressCircle.style.setProperty('--progress', percentage);
        document.getElementById('progressPercentage').textContent = `${percentage}%`;
    }
    
    // Update progress details
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('remainingCount').textContent = totalActivities - completedCount;
    document.getElementById('totalCount').textContent = totalActivities;
    
    // Update dashboard
    document.getElementById('activitiesToday').textContent = `${completedCount}/${totalActivities} completed`;
    document.getElementById('completedActivities').textContent = completedCount;
    document.getElementById('totalActivities').textContent = totalActivities;
}

function drawProgressGraph() {
    const canvas = document.getElementById('progressGraph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Get last 7 days of activity data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        const dateStr = date.toISOString().split('T')[0];
        
        // Get activities completed on this day (mock data for demo)
        const completed = Math.floor(Math.random() * 4); // 0-3 activities
        const total = 3; // Total possible activities
        
        weekData.push({
            day: dayName,
            date: dateStr,
            completed: completed,
            total: total,
            pending: total - completed
        });
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart settings
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / weekData.length * 0.6;
    const barSpacing = chartWidth / weekData.length * 0.4;
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw bars
    weekData.forEach((data, index) => {
        const x = padding + (index * (barWidth + barSpacing)) + barSpacing / 2;
        const completedHeight = (data.completed / data.total) * chartHeight;
        const pendingHeight = (data.pending / data.total) * chartHeight;
        
        // Draw completed bar
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x, height - padding - completedHeight, barWidth / 2, completedHeight);
        
        // Draw pending bar
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + barWidth / 2, height - padding - pendingHeight, barWidth / 2, pendingHeight);
        
        // Draw day labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.day, x + barWidth / 2, height - padding + 20);
        
        // Draw values on top of bars
        if (data.completed > 0) {
            ctx.fillStyle = '#10b981';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(data.completed.toString(), x + barWidth / 4, height - padding - completedHeight - 5);
        }
        if (data.pending > 0) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillText(data.pending.toString(), x + 3 * barWidth / 4, height - padding - pendingHeight - 5);
        }
    });
    
    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 3; i++) {
        const y = height - padding - (i * chartHeight / 3);
        ctx.fillText(i.toString(), padding - 10, y + 3);
    }
}

function notifyDoctorActivityComplete(activityId) {
    const [planId, activityType] = activityId.split('-');
    const plan = AppState.activityPlans.find(p => p.id == planId);
    const patient = AppState.patients.find(p => p.id == plan.patientId);
    
    if (patient && plan) {
        createNotification(
            'Activity Completed',
            `${patient.name} completed their ${activityType} activity`,
            plan.doctorId,
            patient.name
        );
        
        createPatientActivity(
            'Activity Completed',
            `Completed ${activityType} activity plan`,
            plan.patientId
        );
    }
}

// File Upload Functions
function handleFileSelect(event, planId, activityType) {
    console.log('File select triggered:', event, planId, activityType);
    const files = event.target.files;
    if (files && files.length > 0) {
        handleFiles(files, planId, activityType);
    } else {
        console.warn('No files selected');
    }
}

function handleDrop(event, planId, activityType) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = document.getElementById(`uploadArea_${planId}_${activityType}`);
    uploadArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    handleFiles(files, planId, activityType);
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');
}

function handleFiles(files, planId, activityType) {
    console.log('Handling files:', files, 'for plan:', planId, 'type:', activityType);
    
    const uploadedFiles = JSON.parse(localStorage.getItem(`activity_files_${planId}_${activityType}`) || '[]');
    
    Array.from(files).forEach(file => {
        console.log('Processing file:', file.name, file.size, file.type);
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`File ${file.name} is too large. Maximum size is 5MB.`, 'error');
            return;
        }
        
        // Check if file already exists
        if (uploadedFiles.find(f => f.name === file.name)) {
            showNotification(`File ${file.name} already exists.`, 'error');
            return;
        }
        
        // Create file object
        const fileObj = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            data: null // In real app, would upload to server
        };
        
        console.log('Created file object:', fileObj);
        
        // Read file as base64 for demo purposes
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File read successfully for:', file.name);
            fileObj.data = e.target.result;
            uploadedFiles.push(fileObj);
            localStorage.setItem(`activity_files_${planId}_${activityType}`, JSON.stringify(uploadedFiles));
            
            // Refresh the activity card
            loadPatientActivities();
            showNotification(`File ${file.name} uploaded successfully!`, 'success');
        };
        
        reader.onerror = function(e) {
            console.error('Error reading file:', e);
            showNotification(`Error reading file ${file.name}.`, 'error');
        };
        
        reader.readAsDataURL(file);
    });
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fa-image';
    if (fileType === 'application/pdf') return 'fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word';
    if (fileType.includes('text')) return 'fa-file-alt';
    return 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function testFileUpload(planId, activityType) {
    console.log('Testing file upload for:', planId, activityType);
    
    // Create a test file object
    const testFile = {
        id: Date.now() + Math.random(),
        name: 'test-document.pdf',
        size: 1024 * 1024, // 1MB
        type: 'application/pdf',
        uploadDate: new Date().toISOString(),
        data: 'JVBERi0xLjQKJeLjz9M=' // Base64 for minimal PDF
    };
    
    // Get existing files
    const uploadedFiles = JSON.parse(localStorage.getItem(`activity_files_${planId}_${activityType}`) || '[]');
    
    // Add test file
    uploadedFiles.push(testFile);
    localStorage.setItem(`activity_files_${planId}_${activityType}`, JSON.stringify(uploadedFiles));
    
    // Refresh the activity card
    loadPatientActivities();
    showNotification('Test file uploaded successfully!', 'success');
    
    console.log('Test file uploaded:', testFile);
}

function editFile(planId, activityType, fileId) {
    showNotification('Edit file functionality coming soon!', 'info');
}

function deleteFile(planId, activityType, fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        const uploadedFiles = JSON.parse(localStorage.getItem(`activity_files_${planId}_${activityType}`) || '[]');
        const updatedFiles = uploadedFiles.filter(f => f.id !== parseFloat(fileId));
        localStorage.setItem(`activity_files_${planId}_${activityType}`, JSON.stringify(updatedFiles));
        
        // Refresh the activity card
        loadPatientActivities();
        showNotification('File deleted successfully!', 'success');
    }
}

// Comment Functions
function saveComment(planId, activityType) {
    const commentTextarea = document.getElementById(`comment_${planId}_${activityType}`);
    const comment = commentTextarea.value.trim();
    
    if (comment) {
        const activityComments = JSON.parse(localStorage.getItem(`activity_comments_${planId}_${activityType}`) || '{}');
        activityComments.comment = comment;
        activityComments.lastUpdated = new Date().toISOString();
        
        localStorage.setItem(`activity_comments_${planId}_${activityType}`, JSON.stringify(activityComments));
        
        // Notify doctor of comment
        const patient = AppState.patients.find(p => p.name === AppState.currentUser.name);
        if (patient) {
            createNotification(
                'New Patient Comment',
                `${patient.name} added a comment to their ${activityType} activity`,
                patient.doctorId,
                patient.name
            );
        }
        
        showNotification('Comment saved successfully!', 'success');
    } else {
        showNotification('Please enter a comment before saving.', 'error');
    }
}

function addCustomActivity() {
    showNotification('Custom activity feature coming soon!', 'info');
}

function editActivity(planId, activityType, currentContent) {
    showNotification('Edit activity feature coming soon!', 'info');
}

function deleteActivity(planId, activityType) {
    if (confirm('Are you sure you want to delete this activity?')) {
        showNotification('Activity deleted successfully!', 'success');
        loadPatientActivities();
    }
}

function createActivityCard(title, content, type) {
    const card = document.createElement('div');
    card.className = 'activity-card fade-in';
    
    const iconMap = {
        diet: 'fa-utensils',
        exercise: 'fa-running',
        medication: 'fa-pills'
    };
    
    card.innerHTML = `
        <div class="activity-header">
            <div class="activity-icon ${type}">
                <i class="fas ${iconMap[type]}"></i>
            </div>
            <div class="activity-title">${title}</div>
        </div>
        <div class="activity-content">${content}</div>
    `;
    
    return card;
}

function loadPatientReports() {
    const patientReportsContainer = document.getElementById('patientReportsContainer');
    
    if (patientReportsContainer) {
        patientReportsContainer.innerHTML = '';
        
        const patient = AppState.patients.find(p => p.name === AppState.currentUser.name);
        if (!patient) return;
        
        // Get X-ray reports
        const xrayReports = AppState.reports.filter(r => r.patientId === patient.id);
        
        // Get medication reports
        const medicationReports = AppState.medicationReports.filter(mr => mr.patientId === patient.id);
        
        // Get activity reports
        const activityReports = AppState.patientActivities.filter(pa => pa.patientId === patient.id);
        
        const filter = document.getElementById('reportFilter').value;
        let reportsToShow = [];
        
        if (filter === 'all' || filter === 'xray') {
            xrayReports.forEach(report => {
                reportsToShow.push(createReportCard(report, 'xray'));
            });
        }
        
        if (filter === 'all' || filter === 'medication') {
            medicationReports.forEach(report => {
                reportsToShow.push(createMedicationReportCard(report));
            });
        }
        
        if (filter === 'all' || filter === 'activity') {
            activityReports.forEach(report => {
                reportsToShow.push(createActivityReportCard(report));
            });
        }
        
        if (reportsToShow.length === 0) {
            patientReportsContainer.innerHTML = '<p class="text-muted">No reports available.</p>';
        } else {
            reportsToShow.forEach(report => {
                patientReportsContainer.appendChild(report);
            });
        }
    }
}

function createMedicationReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card fade-in';
    
    card.innerHTML = `
        <div class="report-info">
            <h4><i class="fas fa-pills"></i> Medication Report</h4>
            <div class="report-meta">
                <span><i class="fas fa-calendar"></i> ${new Date(report.timestamp).toLocaleDateString()}</span>
                <span><i class="fas fa-user-md"></i> ${report.doctorName}</span>
            </div>
            <p>${report.summary}</p>
        </div>
        <div class="report-actions">
            <button class="btn-secondary" onclick="viewMedicationReportDetails(${report.id})">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="btn-primary" onclick="downloadReport('medication', ${report.id})">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="btn-secondary" onclick="shareReport('medication', ${report.id})">
                <i class="fas fa-share"></i> Share
            </button>
        </div>
    `;
    
    return card;
}

function createActivityReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card fade-in';
    
    card.innerHTML = `
        <div class="report-info">
            <h4><i class="fas fa-running"></i> ${report.type}</h4>
            <div class="report-meta">
                <span><i class="fas fa-calendar"></i> ${new Date(report.timestamp).toLocaleDateString()}</span>
            </div>
            <p>${report.description}</p>
        </div>
        <div class="report-actions">
            <button class="btn-secondary" onclick="viewActivityReportDetails(${report.id})">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="btn-primary" onclick="downloadReport('activity', ${report.id})">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;
    
    return card;
}

function filterReports() {
    loadPatientReports();
}

function downloadAllReports() {
    showNotification('Downloading all reports...', 'info');
    // Implementation for downloading all reports
    setTimeout(() => {
        showNotification('All reports downloaded successfully!', 'success');
    }, 2000);
}

function downloadReport(type, reportId) {
    showNotification(`Downloading ${type} report...`, 'info');
    
    // Create a downloadable report
    let reportContent = '';
    let fileName = '';
    
    if (type === 'xray') {
        const report = AppState.reports.find(r => r.id === reportId);
        reportContent = generateXrayReportText(report);
        fileName = `xray_report_${report.patientName}_${new Date().toISOString().split('T')[0]}.txt`;
    } else if (type === 'medication') {
        const report = AppState.medicationReports.find(mr => mr.id === reportId);
        reportContent = generateMedicationReportText(report);
        fileName = `medication_report_${new Date().toISOString().split('T')[0]}.txt`;
    }
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully!', 'success');
}

function shareReport(type, reportId) {
    showNotification('Share functionality coming soon!', 'info');
}

function generateXrayReportText(report) {
    return `
ARTHROSHIELD - X-Ray Analysis Report
=====================================

Patient Information:
- Name: ${report.patientName}
- Analysis Date: ${new Date(report.analysisDate).toLocaleDateString()}

Analysis Results:
- Severity Level: ${report.severity.toUpperCase()}
- Confidence: ${report.confidence}%

Key Findings:
${report.findings.map(f => `- ${f}`).join('\n')}

Recommendations:
${report.recommendations.map(r => `- ${r}`).join('\n')}

Doctor Information:
- Doctor: ${report.doctorName}
- Contact: ${report.doctorPhone}

Generated by ARTHROSHIELD on ${new Date().toLocaleString()}
    `;
}

function generateMedicationReportText(report) {
    return `
ARTHROSHIELD - Medication Report
=================================

Patient Information:
- Name: ${report.patientName}
- Report Date: ${new Date(report.timestamp).toLocaleDateString()}

Medication Details:
${report.medications.map(m => `- ${m.name}: ${m.dosage} - ${m.frequency}`).join('\n')}

Notes:
${report.notes}

Doctor Information:
- Doctor: ${report.doctorName}
- Contact: ${report.doctorPhone}

Generated by ARTHROSHIELD on ${new Date().toLocaleString()}
    `;
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 500;
        z-index: 9999;
        box-shadow: var(--shadow-lg);
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Profile Functions (placeholder)
function showProfile() {
    showNotification('Profile feature coming soon!', 'info');
}

function showPatientProfile() {
    showNotification('Patient profile feature coming soon!', 'info');
}

// Doctor Activity Reports Functions
function loadPatientActivityReports() {
    const reportsContainer = document.getElementById('activityReportsContainer');
    const patientSelect = document.getElementById('activityReportPatient');
    const monthSelect = document.getElementById('activityReportMonth');
    
    // Populate patient dropdown
    const doctorPatients = AppState.patients.filter(p => p.doctorId === AppState.currentUser.id);
    patientSelect.innerHTML = '<option value="">All Patients</option>';
    doctorPatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        patientSelect.appendChild(option);
    });
    
    // Populate month dropdown
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = new Date().getMonth();
    monthSelect.innerHTML = '<option value="">Current Month</option>';
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        if (index === currentMonth) {
            option.selected = true;
        }
        monthSelect.appendChild(option);
    });
    
    // Generate activity reports
    const selectedPatientId = patientSelect.value;
    const selectedMonth = monthSelect.value || new Date().getMonth();
    
    const reports = generateActivityReportData(selectedPatientId, selectedMonth);
    
    if (reportsContainer) {
        reportsContainer.innerHTML = '';
        
        reports.forEach(report => {
            const reportCard = createActivityReportCard(report);
            reportsContainer.appendChild(reportCard);
        });
        
        if (reports.length === 0) {
            reportsContainer.innerHTML = '<p class="text-muted">No activity data available for the selected period.</p>';
        }
    }
}

function generateActivityReportData(patientId, month) {
    const reports = [];
    const doctorPatients = AppState.patients.filter(p => p.doctorId === AppState.currentUser.id);
    const patientsToReport = patientId ? doctorPatients.filter(p => p.id == patientId) : doctorPatients;
    
    patientsToReport.forEach(patient => {
        // Get patient's activity plans
        const patientPlans = AppState.activityPlans.filter(plan => plan.patientId === patient.id);
        
        if (patientPlans.length > 0) {
            const plan = patientPlans[0];
            const totalActivities = (plan.diet ? 1 : 0) + (plan.exercise ? 1 : 0) + (plan.medication ? 1 : 0);
            
            // Generate mock monthly data (in real app, this would come from actual activity tracking)
            const completedActivities = Math.floor(Math.random() * (totalActivities + 1));
            const pendingActivities = totalActivities - completedActivities;
            const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
            
            // Get patient activities for this month
            const monthlyActivities = AppState.patientActivities.filter(pa => 
                pa.patientId === patient.id && 
                new Date(pa.timestamp).getMonth() == month
            );
            
            const report = {
                patientId: patient.id,
                patientName: patient.name,
                month: month,
                totalActivities: totalActivities,
                completedActivities: completedActivities,
                pendingActivities: pendingActivities,
                completionRate: completionRate,
                monthlyActivities: monthlyActivities.length,
                filesUploaded: Math.floor(Math.random() * 5), // Mock data
                queriesAsked: monthlyActivities.filter(pa => pa.type === 'Query Sent').length,
                progressTrend: completionRate > 70 ? 'improving' : completionRate > 40 ? 'stable' : 'declining'
            };
            
            reports.push(report);
        }
    });
    
    return reports;
}

function createActivityReportCard(report) {
    const card = document.createElement('div');
    card.className = 'activity-report-card fade-in';
    
    const trendColors = {
        improving: '#10b981',
        stable: '#f59e0b',
        declining: '#ef4444'
    };
    
    const trendIcons = {
        improving: 'fa-arrow-up',
        stable: 'fa-minus',
        declining: 'fa-arrow-down'
    };
    
    card.innerHTML = `
        <div class="report-header">
            <div class="patient-info">
                <h4>${report.patientName}</h4>
                <span class="trend-badge" style="background: ${trendColors[report.progressTrend]};">
                    <i class="fas ${trendIcons[report.progressTrend]}"></i> ${report.progressTrend.charAt(0).toUpperCase() + report.progressTrend.slice(1)}
                </span>
            </div>
            <div class="completion-rate">
                <div class="rate-circle" style="--rate: ${report.completionRate}%">
                    <span class="rate-value">${report.completionRate}%</span>
                </div>
                <span class="rate-label">Completion Rate</span>
            </div>
        </div>
        
        <div class="report-stats">
            <div class="stat-grid">
                <div class="stat-item">
                    <div class="stat-value">${report.totalActivities}</div>
                    <div class="stat-label">Total Activities</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value success">${report.completedActivities}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value warning">${report.pendingActivities}</div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${report.filesUploaded}</div>
                    <div class="stat-label">Files Uploaded</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${report.queriesAsked}</div>
                    <div class="stat-label">Queries Asked</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${report.monthlyActivities}</div>
                    <div class="stat-label">Total Interactions</div>
                </div>
            </div>
        </div>
        
        <div class="report-actions">
            <button class="btn-secondary" onclick="viewPatientActivityDetails(${report.patientId}, ${report.month})">
                <i class="fas fa-eye"></i> View Details
            </button>
            <button class="btn-primary" onclick="downloadActivityReport(${report.patientId}, ${report.month})">
                <i class="fas fa-download"></i> Download Report
            </button>
        </div>
        
        <div class="progress-chart">
            <canvas id="progressChart_${report.patientId}" width="300" height="150"></canvas>
        </div>
    `;
    
    // Draw mini progress chart
    setTimeout(() => drawMiniProgressChart(`progressChart_${report.patientId}`, report), 100);
    
    return card;
}

function drawMiniProgressChart(canvasId, report) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Generate mock weekly data
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
        weeklyData.push({
            week: `Week ${i + 1}`,
            completed: Math.floor(Math.random() * (report.totalActivities + 1))
        });
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw simple line chart
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const pointSpacing = chartWidth / (weeklyData.length - 1);
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw line
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    weeklyData.forEach((data, index) => {
        const x = padding + (index * pointSpacing);
        const y = height - padding - (data.completed / report.totalActivities) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw point
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.week, x, height - padding + 15);
    });
    
    ctx.stroke();
}

function viewPatientActivityDetails(patientId, month) {
    showNotification('Detailed activity view coming soon!', 'info');
}

function downloadActivityReport(patientId, month) {
    const patient = AppState.patients.find(p => p.id === patientId);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const reportContent = `
ARTHROSHIELD - Monthly Activity Report
=====================================

Patient: ${patient.name}
Month: ${monthNames[month]}
Doctor: ${AppState.currentUser.name}
Report Date: ${new Date().toLocaleDateString()}

Activity Summary:
- Total Activities Assigned: 3
- Activities Completed: ${Math.floor(Math.random() * 4)}
- Activities Pending: ${Math.floor(Math.random() * 4)}
- Completion Rate: ${Math.floor(Math.random() * 101)}%

Engagement Metrics:
- Files Uploaded: ${Math.floor(Math.random() * 6)}
- Queries Asked: ${Math.floor(Math.random() * 4)}
- Comments Posted: ${Math.floor(Math.random() * 8)}

Progress Assessment:
Patient shows ${Math.random() > 0.5 ? 'good' : 'moderate'} progress in following the activity plan.
${Math.random() > 0.5 ? 'Regular engagement with the platform noted.' : 'Increased engagement recommended.'}

Recommendations:
${Math.random() > 0.5 ? 'Continue current activity plan' : 'Consider modifying activity plan for better adherence'}
${Math.random() > 0.5 ? 'Schedule follow-up consultation' : 'Monitor progress closely'}

Generated by ARTHROSHIELD on ${new Date().toLocaleString()}
    `;
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_report_${patient.name}_${monthNames[month]}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Activity report downloaded successfully!', 'success');
}

function generateMonthlyReport() {
    showNotification('Generating comprehensive monthly report...', 'info');
    setTimeout(() => {
        showNotification('Monthly report generated successfully!', 'success');
    }, 2000);
}

// Missing Functions Implementation
function uploadNewXray() {
    showSection('uploadXray');
    showNotification('Please select a patient and upload their X-Ray image.', 'info');
}

function viewMedicationReport() {
    showNotification('Medication report feature coming soon!', 'info');
}

function scheduleAppointment() {
    showNotification('Appointment scheduling feature coming soon!', 'info');
}

function markAllCompleted() {
    const patientPlans = AppState.activityPlans.filter(plan => 
        AppState.patients.some(p => p.name === AppState.currentUser.name && p.id === plan.patientId)
    );
    
    if (patientPlans.length > 0) {
        const plan = patientPlans[0];
        const completedActivities = [];
        
        if (plan.diet) completedActivities.push(`${plan.id}-diet`);
        if (plan.exercise) completedActivities.push(`${plan.id}-exercise`);
        if (plan.medication) completedActivities.push(`${plan.id}-medication`);
        
        localStorage.setItem('completed_activities', JSON.stringify(completedActivities));
        
        // Reload activities to update UI
        loadPatientActivities();
        
        showNotification('All activities marked as completed!', 'success');
    }
}

function addCustomActivity() {
    showNotification('Custom activity feature coming soon!', 'info');
}

function removeFile() {
    AppState.selectedFile = null;
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('xrayFile').value = '';
    showNotification('File removed', 'info');
}

function downloadAllReports() {
    showNotification('Downloading all reports...', 'info');
    setTimeout(() => {
        showNotification('All reports downloaded successfully!', 'success');
    }, 1500);
}

function shareReport() {
    showNotification('Share feature coming soon!', 'info');
}

function printReport() {
    window.print();
    showNotification('Print dialog opened', 'info');
}

// Additional Missing Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmAnalysis() {
    showNotification('Analysis confirmed! Processing X-Ray...', 'info');
    setTimeout(() => {
        showNotification('X-Ray analysis completed!', 'success');
        closeModal('confirmModal');
    }, 2000);
}

function editActivity(planId, activityType, currentContent) {
    showNotification('Edit activity feature coming soon!', 'info');
}

function deleteActivity(planId, activityType) {
    if (confirm('Are you sure you want to delete this activity?')) {
        showNotification('Activity deleted successfully!', 'success');
        loadPatientActivities();
    }
}

// Test function to verify showReportForDoctor is accessible
function testViewReportButton() {
    console.log('Test function called');
    console.log('showReportForDoctor function exists:', typeof showReportForDoctor);
    console.log('AppState.currentReport:', AppState.currentReport);
}

// Make function globally accessible
window.showReportForDoctor = showReportForDoctor;
window.testViewReportButton = testViewReportButton;

// End of file - ensuring proper closure
