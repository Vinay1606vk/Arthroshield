#!/usr/bin/env python3
"""
ARTHROSHIELD Database Helper
Provides helper functions for database operations without sample data
"""

import sqlite3
import json
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any

class DatabaseHelper:
    def __init__(self, db_path: str = "arthrosheild.db"):
        self.db_path = db_path
        self.conn = None
        
    def connect(self):
        """Connect to the SQLite database"""
        if not self.conn:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
        return self.conn
        
    def disconnect(self):
        """Close the database connection"""
        if self.conn:
            self.conn.close()
            self.conn = None
            
    def initialize_database(self, schema_file: str = "schema.sql"):
        """Initialize database with schema only (no sample data)"""
        try:
            self.connect()
            
            with open(schema_file, 'r') as f:
                schema_sql = f.read()
            
            statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
            
            for statement in statements:
                if statement:
                    self.conn.execute(statement)
                    
            self.conn.commit()
            print("✅ Database schema initialized successfully")
            return True
            
        except Exception as e:
            print(f"❌ Error initializing database: {e}")
            return False
            
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
        
    def generate_patient_id(self, hospital_name: str) -> str:
        """Generate unique patient ID based on hospital"""
        hospital_code = {
            "City Medical Center": "CMC",
            "General Hospital": "GH", 
            "Orthopedic Center": "OC",
            "Regional Medical": "RM"
        }.get(hospital_name, "GEN")
        
        cursor = self.conn.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'patient' AND patient_id LIKE ?",
            (f"{hospital_code}%",)
        )
        count = cursor.fetchone()['count'] + 1
        
        return f"{hospital_code}{count:04d}"
        
    # =============================================
    # USER MANAGEMENT
    # =============================================
    
    def create_user(self, user_data: Dict[str, Any]) -> Optional[int]:
        """Create a new user (doctor or patient)"""
        try:
            self.connect()
            
            # Generate patient ID if needed
            if user_data.get('role') == 'patient' and not user_data.get('patient_id'):
                user_data['patient_id'] = self.generate_patient_id(user_data.get('preferred_hospital', 'General Hospital'))
            
            # Hash password
            if 'password' in user_data:
                user_data['password'] = self.hash_password(user_data['password'])
            
            # Build dynamic query based on provided fields
            columns = list(user_data.keys())
            placeholders = ['?' for _ in columns]
            values = list(user_data.values())
            
            query = f"INSERT INTO users ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            
            cursor = self.conn.execute(query, values)
            self.conn.commit()
            
            user_id = cursor.lastrowid
            
            # Create patient assignment if needed
            if user_data.get('role') == 'patient' and user_data.get('assigned_doctor_id'):
                self.conn.execute("""
                    INSERT INTO patient_assignments (patient_id, doctor_id, created_by)
                    VALUES (?, ?, ?)
                """, (user_id, user_data['assigned_doctor_id'], user_data['assigned_doctor_id']))
                self.conn.commit()
            
            return user_id
            
        except sqlite3.IntegrityError as e:
            print(f"❌ User creation failed (duplicate): {e}")
            return None
        except Exception as e:
            print(f"❌ User creation failed: {e}")
            return None
            
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        try:
            self.connect()
            
            hashed_password = self.hash_password(password)
            
            cursor = self.conn.execute("""
                SELECT id, email, first_name, last_name, role, specialization, 
                       license_number, hospital, age, gender, patient_id
                FROM users 
                WHERE email = ? AND password = ?
            """, (email, hashed_password))
            
            user = cursor.fetchone()
            
            if user:
                return dict(user)
            return None
            
        except Exception as e:
            print(f"❌ Authentication failed: {e}")
            return None
            
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            self.connect()
            
            cursor = self.conn.execute("""
                SELECT * FROM users WHERE id = ?
            """, (user_id,))
            
            user = cursor.fetchone()
            
            if user:
                return dict(user)
            return None
            
        except Exception as e:
            print(f"❌ Get user failed: {e}")
            return None
            
    # =============================================
    # APPOINTMENT MANAGEMENT
    # =============================================
    
    def create_appointment(self, appointment_data: Dict[str, Any]) -> Optional[str]:
        """Create a new appointment"""
        try:
            self.connect()
            
            # Generate appointment ID
            appointment_id = f"APT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            appointment_data['id'] = appointment_id
            
            columns = list(appointment_data.keys())
            placeholders = ['?' for _ in columns]
            values = list(appointment_data.values())
            
            query = f"INSERT INTO appointments ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            
            self.conn.execute(query, values)
            self.conn.commit()
            
            return appointment_id
            
        except Exception as e:
            print(f"❌ Appointment creation failed: {e}")
            return None
            
    def get_appointments_for_user(self, user_id: int, user_role: str) -> List[Dict[str, Any]]:
        """Get appointments for a user (doctor or patient)"""
        try:
            self.connect()
            
            if user_role == 'patient':
                cursor = self.conn.execute("""
                    SELECT * FROM appointments 
                    WHERE patient_id = ? 
                    ORDER BY date DESC, time DESC
                """, (user_id,))
            else:  # doctor
                cursor = self.conn.execute("""
                    SELECT * FROM appointments 
                    WHERE doctor_id = ? 
                    ORDER BY date DESC, time DESC
                """, (user_id,))
            
            return [dict(row) for row in cursor.fetchall()]
            
        except Exception as e:
            print(f"❌ Get appointments failed: {e}")
            return []
            
    # =============================================
    # MEDICAL REPORTS
    # =============================================
    
    def create_medical_report(self, report_data: Dict[str, Any]) -> Optional[str]:
        """Create a new medical report"""
        try:
            self.connect()
            
            # Generate report ID
            report_id = f"RPT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            report_data['id'] = report_id
            
            # Convert arrays to JSON
            if 'findings' in report_data and isinstance(report_data['findings'], list):
                report_data['findings'] = json.dumps(report_data['findings'])
            if 'recommendations' in report_data and isinstance(report_data['recommendations'], list):
                report_data['recommendations'] = json.dumps(report_data['recommendations'])
            
            columns = list(report_data.keys())
            placeholders = ['?' for _ in columns]
            values = list(report_data.values())
            
            query = f"INSERT INTO medical_reports ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            
            self.conn.execute(query, values)
            self.conn.commit()
            
            return report_id
            
        except Exception as e:
            print(f"❌ Medical report creation failed: {e}")
            return None
            
    def get_reports_for_patient(self, patient_id: int) -> List[Dict[str, Any]]:
        """Get medical reports for a patient"""
        try:
            self.connect()
            
            cursor = self.conn.execute("""
                SELECT * FROM medical_reports 
                WHERE patient_id = ? 
                ORDER BY analysis_date DESC
            """, (patient_id,))
            
            reports = []
            for row in cursor.fetchall():
                report = dict(row)
                # Parse JSON fields
                if report.get('findings'):
                    report['findings'] = json.loads(report['findings'])
                if report.get('recommendations'):
                    report['recommendations'] = json.loads(report['recommendations'])
                reports.append(report)
                
            return reports
            
        except Exception as e:
            print(f"❌ Get reports failed: {e}")
            return []
            
    # =============================================
    # ACTIVITY PLANS
    # =============================================
    
    def create_activity_plan(self, plan_data: Dict[str, Any]) -> Optional[str]:
        """Create a new activity plan"""
        try:
            self.connect()
            
            # Generate activity ID
            activity_id = f"ACT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            plan_data['id'] = activity_id
            
            # Convert arrays to JSON
            for field in ['exercise_data', 'diet_data', 'medication_data']:
                if field in plan_data and isinstance(plan_data[field], list):
                    plan_data[field] = json.dumps(plan_data[field])
            
            columns = list(plan_data.keys())
            placeholders = ['?' for _ in columns]
            values = list(plan_data.values())
            
            query = f"INSERT INTO activity_plans ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            
            self.conn.execute(query, values)
            self.conn.commit()
            
            return activity_id
            
        except Exception as e:
            print(f"❌ Activity plan creation failed: {e}")
            return None
            
    def get_activities_for_patient(self, patient_id: int) -> List[Dict[str, Any]]:
        """Get activity plans for a patient"""
        try:
            self.connect()
            
            cursor = self.conn.execute("""
                SELECT * FROM activity_plans 
                WHERE patient_id = ? 
                ORDER BY created_at DESC
            """, (patient_id,))
            
            activities = []
            for row in cursor.fetchall():
                activity = dict(row)
                # Parse JSON fields
                for field in ['exercise_data', 'diet_data', 'medication_data']:
                    if activity.get(field):
                        activity[field] = json.loads(activity[field])
                activities.append(activity)
                
            return activities
            
        except Exception as e:
            print(f"❌ Get activities failed: {e}")
            return []
            
    # =============================================
    # PROGRESS TRACKING
    # =============================================
    
    def update_progress(self, patient_id: int, activity_id: str, item_type: str, 
                        item_index: int, completed: bool = True) -> bool:
        """Update progress for a specific activity item"""
        try:
            self.connect()
            
            self.conn.execute("""
                INSERT OR REPLACE INTO patient_progress 
                (patient_id, activity_id, item_type, item_index, completed, completed_at, task_name, last_updated)
                VALUES (?, ?, ?, ?, ?, ?, 
                        (SELECT task_name FROM patient_progress WHERE patient_id = ? AND activity_id = ? AND item_type = ? AND item_index = ?),
                        CURRENT_TIMESTAMP)
            """, (patient_id, activity_id, item_type, item_index, completed, 
                  datetime.now().isoformat() if completed else None,
                  patient_id, activity_id, item_type, item_index))
            
            self.conn.commit()
            return True
            
        except Exception as e:
            print(f"❌ Progress update failed: {e}")
            return False
            
    def get_progress_for_patient(self, patient_id: int) -> List[Dict[str, Any]]:
        """Get progress data for a patient"""
        try:
            self.connect()
            
            cursor = self.conn.execute("""
                SELECT * FROM patient_progress 
                WHERE patient_id = ? 
                ORDER BY last_updated DESC
            """, (patient_id,))
            
            return [dict(row) for row in cursor.fetchall()]
            
        except Exception as e:
            print(f"❌ Get progress failed: {e}")
            return []
            
    # =============================================
    # HEALTH TIPS
    # =============================================
    
    def get_health_tips(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get health tips, optionally filtered by category"""
        try:
            self.connect()
            
            if category:
                cursor = self.conn.execute("""
                    SELECT * FROM health_tips 
                    WHERE condition_category = ? AND is_active = 1
                    ORDER BY RANDOM()
                """, (category,))
            else:
                cursor = self.conn.execute("""
                    SELECT * FROM health_tips 
                    WHERE is_active = 1
                    ORDER BY RANDOM()
                """)
            
            return [dict(row) for row in cursor.fetchall()]
            
        except Exception as e:
            print(f"❌ Get health tips failed: {e}")
            return []
            
    # =============================================
    # DASHBOARD STATISTICS
    # =============================================
    
    def get_patient_dashboard_stats(self, patient_id: int) -> Dict[str, Any]:
        """Get dashboard statistics for a patient"""
        try:
            self.connect()
            
            # Get counts
            reports_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM medical_reports WHERE patient_id = ?", 
                (patient_id,)
            ).fetchone()['count']
            
            activities_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM activity_plans WHERE patient_id = ?", 
                (patient_id,)
            ).fetchone()['count']
            
            appointments_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?", 
                (patient_id,)
            ).fetchone()['count']
            
            upcoming_appointments = self.conn.execute(
                "SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND date >= date('now')", 
                (patient_id,)
            ).fetchone()['count']
            
            return {
                'total_reports': reports_count,
                'total_activities': activities_count,
                'total_appointments': appointments_count,
                'upcoming_appointments': upcoming_appointments
            }
            
        except Exception as e:
            print(f"❌ Get patient stats failed: {e}")
            return {}
            
    def get_doctor_dashboard_stats(self, doctor_id: int) -> Dict[str, Any]:
        """Get dashboard statistics for a doctor"""
        try:
            self.connect()
            
            # Get counts
            patients_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM patient_assignments WHERE doctor_id = ? AND status = 'active'", 
                (doctor_id,)
            ).fetchone()['count']
            
            reports_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM medical_reports WHERE doctor_id = ?", 
                (doctor_id,)
            ).fetchone()['count']
            
            activities_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM activity_plans WHERE doctor_id = ? AND status = 'active'", 
                (doctor_id,)
            ).fetchone()['count']
            
            appointments_count = self.conn.execute(
                "SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND date >= date('now')", 
                (doctor_id,)
            ).fetchone()['count']
            
            return {
                'total_patients': patients_count,
                'total_reports': reports_count,
                'active_activities': activities_count,
                'upcoming_appointments': appointments_count
            }
            
        except Exception as e:
            print(f"❌ Get doctor stats failed: {e}")
            return {}

# =============================================
# USAGE EXAMPLES
# =============================================

def example_usage():
    """Example usage of the DatabaseHelper class"""
    db = DatabaseHelper()
    
    # Initialize database
    if db.initialize_database():
        print("Database ready for use!")
    
    # Example: Create a doctor
    doctor_data = {
        'email': 'dr.test@hospital.com',
        'password': 'test123',
        'first_name': 'Test',
        'last_name': 'Doctor',
        'phone': '+1-555-0000',
        'address': '123 Test St',
        'role': 'doctor',
        'specialization': 'Orthopedic Surgeon',
        'license_number': 'TEST123',
        'hospital': 'Test Hospital',
        'newsletter_preference': 1
    }
    
    doctor_id = db.create_user(doctor_data)
    if doctor_id:
        print(f"Created doctor with ID: {doctor_id}")
    
    # Example: Authenticate user
    user = db.authenticate_user('dr.test@hospital.com', 'test123')
    if user:
        print(f"Authenticated: {user['first_name']} {user['last_name']} ({user['role']})")
    
    db.disconnect()

if __name__ == "__main__":
    example_usage()
