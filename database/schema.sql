-- ARTHROSHIELD Medical Platform Database Schema
-- SQLite Database Schema for Orthopedic Care Management System

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
    newsletter_preference BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Doctor-specific fields
    specialization TEXT,
    license_number TEXT,
    hospital TEXT,
    
    -- Patient-specific fields
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    preferred_hospital TEXT,
    patient_id TEXT UNIQUE, -- Auto-generated per hospital
    assigned_doctor_id INTEGER,
    
    FOREIGN KEY (assigned_doctor_id) REFERENCES users(id)
);

-- =============================================
-- APPOINTMENTS TABLE
-- =============================================
CREATE TABLE appointments (
    id TEXT PRIMARY KEY, -- Format: APT-YYYYMMDD-HHMM-SSS
    patient_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    doctor_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL, -- Format: HH:MM
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- =============================================
-- MEDICAL REPORTS TABLE
-- =============================================
CREATE TABLE medical_reports (
    id TEXT PRIMARY KEY, -- Format: RPT-YYYYMMDD-HHMM-SSS
    patient_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    doctor_name TEXT NOT NULL,
    analysis_date DATETIME NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    findings TEXT, -- JSON array of findings
    recommendations TEXT, -- JSON array of recommendations
    doctor_comments TEXT,
    image_path TEXT,
    image_metadata TEXT, -- JSON object with size, format, dimensions
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- =============================================
-- ACTIVITY PLANS TABLE
-- =============================================
CREATE TABLE activity_plans (
    id TEXT PRIMARY KEY, -- Format: ACT-YYYYMMDD-HHMM-SSS
    patient_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    doctor_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('exercise', 'diet', 'medication')),
    exercise_data TEXT, -- JSON array for exercise items
    diet_data TEXT, -- JSON array for diet items
    medication_data TEXT, -- JSON array for medication items
    duration_value INTEGER NOT NULL,
    duration_unit TEXT NOT NULL CHECK (duration_unit IN ('days', 'weeks', 'months')),
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- =============================================
-- PATIENT PROGRESS TABLE
-- =============================================
CREATE TABLE patient_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    activity_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('exercise', 'diet', 'medication')),
    item_index INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    task_name TEXT NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (activity_id) REFERENCES activity_plans(id) ON DELETE CASCADE,
    UNIQUE(patient_id, activity_id, item_type, item_index)
);

-- =============================================
-- X-RAY UPLOADS TABLE
-- =============================================
CREATE TABLE xray_uploads (
    id TEXT PRIMARY KEY, -- Format: XRY-YYYYMMDD-HHMM-SSS
    patient_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_format TEXT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    analysis_date DATETIME,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
    confidence REAL CHECK (confidence >= 0 AND confidence <= 1),
    findings TEXT, -- JSON array of findings
    recommendations TEXT, -- JSON array of recommendations
    is_self_analysis BOOLEAN DEFAULT 0, -- 0 for doctor uploads, 1 for patient self-analysis
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- =============================================
-- PATIENT ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE patient_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_by INTEGER, -- Doctor who created the assignment
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(patient_id, doctor_id)
);

-- =============================================
-- HEALTH TIPS TABLE
-- =============================================
CREATE TABLE health_tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tip_content TEXT NOT NULL,
    condition_category TEXT, -- For personalization based on patient condition
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_patient_id ON users(patient_id);
CREATE INDEX idx_users_assigned_doctor ON users(assigned_doctor_id);
CREATE INDEX idx_users_license ON users(license_number);

-- Appointments table indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_patient_doctor ON appointments(patient_id, doctor_id);

-- Medical reports table indexes
CREATE INDEX idx_medical_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX idx_medical_reports_doctor_id ON medical_reports(doctor_id);
CREATE INDEX idx_medical_reports_severity ON medical_reports(severity);
CREATE INDEX idx_medical_reports_analysis_date ON medical_reports(analysis_date);

-- Activity plans table indexes
CREATE INDEX idx_activity_plans_patient_id ON activity_plans(patient_id);
CREATE INDEX idx_activity_plans_doctor_id ON activity_plans(doctor_id);
CREATE INDEX idx_activity_plans_type ON activity_plans(type);
CREATE INDEX idx_activity_plans_status ON activity_plans(status);
CREATE INDEX idx_activity_plans_end_date ON activity_plans(end_date);

-- Patient progress table indexes
CREATE INDEX idx_patient_progress_patient_id ON patient_progress(patient_id);
CREATE INDEX idx_patient_progress_activity_id ON patient_progress(activity_id);
CREATE INDEX idx_patient_progress_completed ON patient_progress(completed);
CREATE INDEX idx_patient_progress_item_type ON patient_progress(item_type);

-- X-ray uploads table indexes
CREATE INDEX idx_xray_uploads_patient_id ON xray_uploads(patient_id);
CREATE INDEX idx_xray_uploads_upload_date ON xray_uploads(upload_date);
CREATE INDEX idx_xray_uploads_severity ON xray_uploads(severity);
CREATE INDEX idx_xray_uploads_self_analysis ON xray_uploads(is_self_analysis);

-- Patient assignments table indexes
CREATE INDEX idx_patient_assignments_patient_id ON patient_assignments(patient_id);
CREATE INDEX idx_patient_assignments_doctor_id ON patient_assignments(doctor_id);
CREATE INDEX idx_patient_assignments_status ON patient_assignments(status);

-- Health tips table indexes
CREATE INDEX idx_health_tips_category ON health_tips(condition_category);
CREATE INDEX idx_health_tips_active ON health_tips(is_active);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update updated_at timestamp for users
CREATE TRIGGER update_users_timestamp 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update updated_at timestamp for appointments
CREATE TRIGGER update_appointments_timestamp 
AFTER UPDATE ON appointments
BEGIN
    UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update updated_at timestamp for medical reports
CREATE TRIGGER update_medical_reports_timestamp 
AFTER UPDATE ON medical_reports
BEGIN
    UPDATE medical_reports SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update updated_at timestamp for activity plans
CREATE TRIGGER update_activity_plans_timestamp 
AFTER UPDATE ON activity_plans
BEGIN
    UPDATE activity_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update last_updated timestamp for patient progress
CREATE TRIGGER update_patient_progress_timestamp 
AFTER UPDATE ON patient_progress
BEGIN
    UPDATE patient_progress SET last_updated = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update updated_at timestamp for health tips
CREATE TRIGGER update_health_tips_timestamp 
AFTER UPDATE ON health_tips
BEGIN
    UPDATE health_tips SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Patient dashboard statistics view
CREATE VIEW patient_dashboard_stats AS
SELECT 
    u.id as patient_id,
    u.name as patient_name,
    COUNT(DISTINCT mr.id) as total_reports,
    COUNT(DISTINCT ap.id) as total_activities,
    COUNT(DISTINCT apt.id) as total_appointments,
    COUNT(DISTINCT CASE WHEN apt.status = 'upcoming' THEN apt.id END) as upcoming_appointments,
    MAX(mr.analysis_date) as last_analysis_date
FROM users u
LEFT JOIN medical_reports mr ON u.id = mr.patient_id
LEFT JOIN activity_plans ap ON u.id = ap.patient_id
LEFT JOIN appointments apt ON u.id = apt.patient_id
WHERE u.role = 'patient'
GROUP BY u.id, u.name;

-- Doctor dashboard statistics view
CREATE VIEW doctor_dashboard_stats AS
SELECT 
    u.id as doctor_id,
    u.name as doctor_name,
    COUNT(DISTINCT pa.patient_id) as total_patients,
    COUNT(DISTINCT mr.id) as pending_reports,
    COUNT(DISTINCT ap.id) as completed_analysis,
    COUNT(DISTINCT act.id) as active_activities
FROM users u
LEFT JOIN patient_assignments pa ON u.id = pa.doctor_id AND pa.status = 'active'
LEFT JOIN medical_reports mr ON u.id = mr.doctor_id
LEFT JOIN activity_plans ap ON u.id = ap.doctor_id AND ap.status = 'active'
LEFT JOIN appointments apt ON u.id = apt.doctor_id
WHERE u.role = 'doctor'
GROUP BY u.id, u.name;

-- Patient progress summary view
CREATE VIEW patient_progress_summary AS
SELECT 
    pp.patient_id,
    ap.id as activity_id,
    ap.type,
    COUNT(*) as total_items,
    SUM(CASE WHEN pp.completed = 1 THEN 1 ELSE 0 END) as completed_items,
    ROUND((SUM(CASE WHEN pp.completed = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) as completion_percentage,
    MAX(pp.completed_at) as last_completion_date
FROM patient_progress pp
JOIN activity_plans ap ON pp.activity_id = ap.id
GROUP BY pp.patient_id, ap.id, ap.type;
