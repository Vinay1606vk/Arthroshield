#!/usr/bin/env python3
"""
ARTHROSHIELD Database Initialization Script
This script initializes the SQLite database with the schema and sample data
"""

import sqlite3
import json
from datetime import datetime, timedelta
import hashlib
import uuid

class DatabaseInitializer:
    def __init__(self, db_path="arthrosheild.db"):
        self.db_path = db_path
        self.conn = None
        
    def connect(self):
        """Connect to the SQLite database"""
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
        
    def disconnect(self):
        """Close the database connection"""
        if self.conn:
            self.conn.close()
            
    def execute_schema(self, schema_file="schema.sql"):
        """Execute the database schema"""
        try:
            with open(schema_file, 'r') as f:
                schema_sql = f.read()
            
            # Split the schema into individual statements
            statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
            
            for statement in statements:
                if statement:
                    self.conn.execute(statement)
                    
            self.conn.commit()
            print("✅ Database schema created successfully")
            
        except Exception as e:
            print(f"❌ Error creating schema: {e}")
            raise
            
    def generate_patient_id(self, hospital_name):
        """Generate unique patient ID based on hospital"""
        hospital_code = {
            "City Medical Center": "CMC",
            "General Hospital": "GH", 
            "Orthopedic Center": "OC",
            "Regional Medical": "RM"
        }.get(hospital_name, "GEN")
        
        # Get next sequence number for this hospital
        cursor = self.conn.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'patient' AND patient_id LIKE ?",
            (f"{hospital_code}%",)
        )
        count = cursor.fetchone()['count'] + 1
        
        return f"{hospital_code}{count:04d}"
        
    def hash_password(self, password):
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
        
    def create_sample_doctors(self):
        """Create sample doctor accounts"""
        doctors = [
            {
                "email": "dr.sarah@citymedical.com",
                "password": "doctor123",
                "first_name": "Sarah",
                "last_name": "Johnson",
                "phone": "+1-555-0101",
                "address": "123 Medical Center Dr, City, State 12345",
                "specialization": "Orthopedic Surgeon",
                "license_number": "MD123456",
                "hospital": "City Medical Center",
                "newsletter_preference": 1
            },
            {
                "email": "dr.michael@citymedical.com", 
                "password": "doctor123",
                "first_name": "Michael",
                "last_name": "Brown",
                "phone": "+1-555-0102",
                "address": "124 Medical Center Dr, City, State 12345",
                "specialization": "Rheumatologist",
                "license_number": "MD789012",
                "hospital": "City Medical Center",
                "newsletter_preference": 0
            },
            {
                "email": "dr.emily@general.com",
                "password": "doctor123", 
                "first_name": "Emily",
                "last_name": "Wilson",
                "phone": "+1-555-0103",
                "address": "456 Hospital Ave, Town, State 67890",
                "specialization": "General Practitioner",
                "license_number": "MD345678",
                "hospital": "General Hospital",
                "newsletter_preference": 1
            }
        ]
        
        for doctor in doctors:
            try:
                self.conn.execute("""
                    INSERT INTO users (
                        email, password, first_name, last_name, phone, address,
                        role, specialization, license_number, hospital, newsletter_preference
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    doctor["email"],
                    self.hash_password(doctor["password"]),
                    doctor["first_name"],
                    doctor["last_name"], 
                    doctor["phone"],
                    doctor["address"],
                    "doctor",
                    doctor["specialization"],
                    doctor["license_number"],
                    doctor["hospital"],
                    doctor["newsletter_preference"]
                ))
                print(f"✅ Created doctor: {doctor['first_name']} {doctor['last_name']}")
            except sqlite3.IntegrityError:
                print(f"⚠️  Doctor {doctor['email']} already exists")
                
        self.conn.commit()
        
    def create_sample_patients(self):
        """Create sample patient accounts"""
        patients = [
            {
                "email": "john.doe@email.com",
                "password": "patient123",
                "first_name": "John",
                "last_name": "Doe",
                "phone": "+1-555-0201",
                "address": "789 Patient St, City, State 12345",
                "age": 45,
                "gender": "male",
                "preferred_hospital": "City Medical Center",
                "newsletter_preference": 1
            },
            {
                "email": "jane.smith@email.com",
                "password": "patient123",
                "first_name": "Jane", 
                "last_name": "Smith",
                "phone": "+1-555-0202",
                "address": "790 Patient St, City, State 12345",
                "age": 38,
                "gender": "female",
                "preferred_hospital": "City Medical Center",
                "newsletter_preference": 0
            },
            {
                "email": "robert.jones@email.com",
                "password": "patient123",
                "first_name": "Robert",
                "last_name": "Jones", 
                "phone": "+1-555-0203",
                "address": "156 Health Ave, Town, State 67890",
                "age": 52,
                "gender": "male",
                "preferred_hospital": "General Hospital",
                "newsletter_preference": 1
            }
        ]
        
        # Get doctor IDs for assignment
        doctors = self.conn.execute("SELECT id, name, hospital FROM users WHERE role = 'doctor'").fetchall()
        
        for patient in patients:
            try:
                # Assign to first available doctor from preferred hospital
                assigned_doctor = None
                for doctor in doctors:
                    if doctor['hospital'] == patient['preferred_hospital']:
                        assigned_doctor = doctor
                        break
                
                patient_id = self.generate_patient_id(patient['preferred_hospital'])
                
                self.conn.execute("""
                    INSERT INTO users (
                        email, password, first_name, last_name, phone, address,
                        role, age, gender, preferred_hospital, newsletter_preference,
                        patient_id, assigned_doctor_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    patient["email"],
                    self.hash_password(patient["password"]),
                    patient["first_name"],
                    patient["last_name"],
                    patient["phone"],
                    patient["address"],
                    "patient",
                    patient["age"],
                    patient["gender"],
                    patient["preferred_hospital"],
                    patient["newsletter_preference"],
                    patient_id,
                    assigned_doctor['id'] if assigned_doctor else None
                ))
                
                # Create patient assignment
                if assigned_doctor:
                    self.conn.execute("""
                        INSERT INTO patient_assignments (patient_id, doctor_id, created_by)
                        VALUES (?, ?, ?)
                    """, (self.conn.lastrowid, assigned_doctor['id'], assigned_doctor['id']))
                
                print(f"✅ Created patient: {patient['first_name']} {patient['last_name']} (ID: {patient_id})")
                
            except sqlite3.IntegrityError:
                print(f"⚠️  Patient {patient['email']} already exists")
                
        self.conn.commit()
        
    def create_sample_appointments(self):
        """Create sample appointments"""
        # Get users
        patients = self.conn.execute("SELECT id, name FROM users WHERE role = 'patient'").fetchall()
        doctors = self.conn.execute("SELECT id, name FROM users WHERE role = 'doctor'").fetchall()
        
        if not patients or not doctors:
            print("⚠️  No patients or doctors found for sample appointments")
            return
            
        sample_appointments = [
            {
                "date": (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d'),
                "time": "10:00",
                "reason": "Follow-up consultation",
                "status": "confirmed"
            },
            {
                "date": (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                "time": "14:30",
                "reason": "X-ray analysis review",
                "status": "pending"
            },
            {
                "date": (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d'),
                "time": "09:15",
                "reason": "Initial consultation",
                "status": "completed"
            }
        ]
        
        for i, apt_data in enumerate(sample_appointments):
            if i < len(patients):
                patient = patients[i]
                doctor = doctors[i % len(doctors)]
                
                appointment_id = f"APT-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}"
                
                self.conn.execute("""
                    INSERT INTO appointments (
                        id, patient_id, patient_name, doctor_id, doctor_name,
                        date, time, reason, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    appointment_id,
                    patient['id'],
                    patient['name'],
                    doctor['id'],
                    doctor['name'],
                    apt_data['date'],
                    apt_data['time'],
                    apt_data['reason'],
                    apt_data['status']
                ))
                
                print(f"✅ Created appointment: {appointment_id}")
                
        self.conn.commit()
        
    def create_sample_medical_reports(self):
        """Create sample medical reports"""
        patients = self.conn.execute("SELECT id, name FROM users WHERE role = 'patient'").fetchall()
        doctors = self.conn.execute("SELECT id, name FROM users WHERE role = 'doctor'").fetchall()
        
        if not patients or not doctors:
            print("⚠️  No patients or doctors found for sample reports")
            return
            
        sample_reports = [
            {
                "severity": "medium",
                "confidence": 0.85,
                "findings": ["Moderate joint space narrowing", "Cartilage thinning detected", "Mild bone sclerosis present"],
                "recommendations": ["Consider physical therapy", "Anti-inflammatory medication as needed", "Follow-up X-ray in 6 months"],
                "doctor_comments": "Patient shows moderate osteoarthritis symptoms. Recommend conservative treatment approach."
            },
            {
                "severity": "low", 
                "confidence": 0.92,
                "findings": ["Joint space appears normal", "No significant abnormalities detected", "Bone density within expected range"],
                "recommendations": ["Continue current treatment plan", "Regular low-impact exercise", "Maintain healthy weight"],
                "doctor_comments": "No acute pathology detected. Patient condition is stable."
            }
        ]
        
        for i, report_data in enumerate(sample_reports):
            if i < len(patients):
                patient = patients[i]
                doctor = doctors[i % len(doctors)]
                
                report_id = f"RPT-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}"
                
                self.conn.execute("""
                    INSERT INTO medical_reports (
                        id, patient_id, patient_name, doctor_id, doctor_name,
                        analysis_date, severity, confidence, findings, recommendations, doctor_comments
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    report_id,
                    patient['id'],
                    patient['name'],
                    doctor['id'],
                    doctor['name'],
                    datetime.now().isoformat(),
                    report_data['severity'],
                    report_data['confidence'],
                    json.dumps(report_data['findings']),
                    json.dumps(report_data['recommendations']),
                    report_data['doctor_comments']
                ))
                
                print(f"✅ Created medical report: {report_id}")
                
        self.conn.commit()
        
    def create_sample_health_tips(self):
        """Create sample health tips"""
        health_tips = [
            ("Stay active with low-impact exercises to maintain joint health and mobility.", "general"),
            ("Maintain a healthy weight to reduce stress on your joints and improve overall health.", "general"),
            ("Include calcium-rich foods in your diet for stronger bones and joints.", "diet"),
            ("Practice proper posture when sitting and standing to prevent joint strain.", "exercise"),
            ("Take regular breaks from repetitive activities to prevent joint overuse.", "exercise"),
            ("Stay hydrated by drinking plenty of water throughout the day.", "general"),
            ("Consider warm-up exercises before physical activities to prepare your joints.", "exercise"),
            ("Use proper footwear to support your joints during physical activities.", "exercise")
        ]
        
        for tip_content, category in health_tips:
            self.conn.execute("""
                INSERT INTO health_tips (tip_content, condition_category)
                VALUES (?, ?)
            """, (tip_content, category))
            
        print("✅ Created 8 sample health tips")
        self.conn.commit()
        
    def create_sample_activity_plans(self):
        """Create sample activity plans"""
        patients = self.conn.execute("SELECT id, name FROM users WHERE role = 'patient'").fetchall()
        doctors = self.conn.execute("SELECT id, name FROM users WHERE role = 'doctor'").fetchall()
        
        if not patients or not doctors:
            print("⚠️  No patients or doctors found for sample activity plans")
            return
            
        # Sample exercise data
        exercise_data = [
            {"name": "Knee Strengthening", "duration": "15", "frequency": "3 times daily"},
            {"name": "Hamstring Stretch", "duration": "10", "frequency": "2 times daily"},
            {"name": "Quad Sets", "duration": "20", "frequency": "4 times daily"}
        ]
        
        # Sample diet data
        diet_data = [
            {"food": "Leafy Greens", "calories": "50", "timing": "With lunch"},
            {"food": "Salmon", "calories": "200", "timing": "With dinner"},
            {"food": "Berries", "calories": "80", "timing": "As snack"}
        ]
        
        # Sample medication data
        medication_data = [
            {"name": "Calcium Supplement", "dosage": "500mg", "timing": "With breakfast"},
            {"name": "Vitamin D", "dosage": "1000IU", "timing": "With breakfast"},
            {"name": "Omega-3", "dosage": "1000mg", "timing": "With dinner"}
        ]
        
        for i, patient in enumerate(patients[:2]):  # Create plans for first 2 patients
            doctor = doctors[i % len(doctors)]
            
            # Exercise plan
            exercise_id = f"ACT-EX-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}"
            self.conn.execute("""
                INSERT INTO activity_plans (
                    id, patient_id, patient_name, doctor_id, doctor_name,
                    type, exercise_data, duration_value, duration_unit, end_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                exercise_id,
                patient['id'],
                patient['name'],
                doctor['id'],
                doctor['name'],
                'exercise',
                json.dumps(exercise_data),
                4, 'weeks',
                (datetime.now() + timedelta(weeks=4)).strftime('%Y-%m-%d')
            ))
            
            # Diet plan
            diet_id = f"ACT-DI-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}"
            self.conn.execute("""
                INSERT INTO activity_plans (
                    id, patient_id, patient_name, doctor_id, doctor_name,
                    type, diet_data, duration_value, duration_unit, end_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                diet_id,
                patient['id'],
                patient['name'],
                doctor['id'],
                doctor['name'],
                'diet',
                json.dumps(diet_data),
                4, 'weeks',
                (datetime.now() + timedelta(weeks=4)).strftime('%Y-%m-%d')
            ))
            
            print(f"✅ Created activity plans for patient: {patient['name']}")
            
        self.conn.commit()
        
    def initialize_database(self):
        """Initialize the complete database with schema and sample data"""
        try:
            print("🚀 Initializing ARTHROSHIELD Database...")
            
            # Connect to database
            self.connect()
            
            # Execute schema
            self.execute_schema()
            
            # Create sample data
            print("\n📊 Creating sample data...")
            self.create_sample_doctors()
            self.create_sample_patients()
            self.create_sample_appointments()
            self.create_sample_medical_reports()
            self.create_sample_health_tips()
            self.create_sample_activity_plans()
            
            print("\n✅ Database initialization completed successfully!")
            print(f"📍 Database file: {self.db_path}")
            
            # Print summary
            self.print_database_summary()
            
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            raise
        finally:
            self.disconnect()
            
    def print_database_summary(self):
        """Print a summary of the created database"""
        self.connect()
        
        print("\n📈 Database Summary:")
        print("=" * 50)
        
        tables = [
            ("Users", "users"),
            ("Appointments", "appointments"), 
            ("Medical Reports", "medical_reports"),
            ("Activity Plans", "activity_plans"),
            ("Patient Progress", "patient_progress"),
            ("X-ray Uploads", "xray_uploads"),
            ("Patient Assignments", "patient_assignments"),
            ("Health Tips", "health_tips")
        ]
        
        for table_name, table_sql in tables:
            try:
                cursor = self.conn.execute(f"SELECT COUNT(*) as count FROM {table_sql}")
                count = cursor.fetchone()['count']
                print(f"  {table_name}: {count} records")
            except sqlite3.OperationalError:
                print(f"  {table_name}: 0 records")
                
        print("=" * 50)
        self.disconnect()

def main():
    """Main function to run the database initialization"""
    initializer = DatabaseInitializer()
    initializer.initialize_database()

if __name__ == "__main__":
    main()
