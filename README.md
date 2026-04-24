# ARTHROSHIELD - Advanced Knee Osteoarthritis Care Platform

**Tagline:** *Protecting Your Mobility, Empowering Your Recovery*

## Overview

ARTHROSHIELD is a comprehensive web application designed for knee osteoarthritis severity analysis and patient management. The platform allows doctors to upload and analyze knee X-ray images, generate detailed reports, and create personalized activity plans for patients. Patients can view their reports, track their progress, and follow prescribed activities.

## Features

### For Doctors
- **Patient Management**: Add, edit, and manage patient records
- **X-Ray Analysis**: Upload knee X-ray images for automated severity analysis
- **Report Generation**: Generate comprehensive analysis reports with findings and recommendations
- **Activity Planning**: Create personalized diet, exercise, and medication plans
- **Dashboard**: Overview of all patients and their status

### For Patients
- **Personal Dashboard**: View personal health information and latest analysis results
- **Activity Tracking**: Access and follow prescribed activity plans
- **Report Viewing**: View detailed X-ray analysis reports
- **Progress Monitoring**: Track adherence to treatment plans

## Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript**: Core web technologies
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Professional, healthcare-focused design

### Backend
- **Python (Flask)**: Web server and API endpoints
- **TensorFlow / Keras**: ML model inference for severity classification
- **PIL (Pillow)**: Image manipulation
- **NumPy**: Numerical computations

### Data Storage
- **LocalStorage**: Client-side data persistence (for demo purposes)
- **JSON**: Data interchange format

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- Trained Keras model file: `backend/model.h5`
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Add the model file:**
   - Place your trained model at: `backend/model.h5`
   - The backend resolves the path relative to `backend/app.py` (so it works even if you launch the server using an absolute path).

3. **Start the Backend Server:**
   ```bash
   cd backend
   python app.py
   ```
   
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Open the Application:**
   - Open `index.html` in a modern web browser
   - Or serve it with a local web server for better performance

2. **Optional: Use a Local Web Server:**
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   
   # Then open http://localhost:8000
   ```

## Usage

### Getting Started

1. **Doctor Registration:**
   - Click "Sign Up" and select "Doctor" role
   - Fill in professional details (name, specialization, hospital, etc.)
   - Complete registration to access the doctor dashboard

2. **Patient Registration:**
   - Click "Sign Up" and select "Patient" role
   - Choose hospital and consulting doctor from dropdown
   - Fill in personal details to access the patient dashboard

### Doctor Workflow

1. **Add Patients:**
   - Navigate to "Patients" section
   - Click "Add Patient" and enter patient details
   - Patients appear in the patient grid

2. **Upload and Analyze X-Rays:**
   - Go to "Upload X-Ray" section
   - Select patient from dropdown
   - Upload X-ray image (drag-and-drop or click to browse)
   - Click "Start Analysis" and confirm when prompted
   - View or print the generated report

3. **Create Activity Plans:**
   - Navigate to "Activity Planner"
   - Click "Create New Plan"
   - Select patient and enter diet, exercise, and medication recommendations
   - Submit to save the plan

4. **View Reports:**
   - Access "Reports" section to see all patient analyses
   - Click "View" to see detailed reports
   - Click "Print" to generate printable versions

### Patient Workflow

1. **Dashboard Overview:**
   - View latest X-ray analysis date and severity
   - See daily activity count
   - Monitor overall health status

2. **Follow Activity Plans:**
   - Go to "My Activities" section
   - View diet, exercise, and medication plans
   - Follow prescribed recommendations

3. **Access Reports:**
   - Navigate to "My Reports"
   - View all X-ray analysis reports
   - Download or print reports as needed

## API Endpoints

### Backend API

- `POST /api/analyze-xray`: Analyze X-ray image
  - Request: `{"image": "base64_string", "patientId": "patient_id"}`
  - Response: Analysis results from the ML model (no dummy output)
    - `severity`: `low|medium|high`
    - `confidence`: numeric (0-1)
    - `predicted_class`: `Normal|Severe|Moderate|Mild|Doubtful`
    - `class_probabilities`: probability per class label

- `GET /api/health`: Health check
  - Response: Server status and timestamp

- `GET /api/test-model`: Test model connectivity
  - Response: Model metadata (input/output shape, classes)

## Data Structure

### Patient Record
```json
{
  "id": "unique_id",
  "name": "Patient Name",
  "age": 45,
  "gender": "male|female|other",
  "phone": "phone_number",
  "address": "full_address",
  "doctorId": "doctor_id",
  "doctorName": "Doctor Name",
  "createdAt": "timestamp"
}
```

### Analysis Report
```json
{
  "id": "unique_id",
  "patientId": "patient_id",
  "patientName": "Patient Name",
  "doctorId": "doctor_id",
  "doctorName": "Doctor Name",
  "severity": "low|medium|high",
  "predictedClass": "Normal|Severe|Moderate|Mild|Doubtful",
  "analysisMethod": "keras_model",
  "classProbabilities": {"Normal": 0.1, "Severe": 0.7, "Moderate": 0.1, "Mild": 0.05, "Doubtful": 0.05},
  "analysisDate": "timestamp",
  "confidence": 0.85,
  "imageData": "data:image/png;base64,...",
  "doctorComments": "..."
}
```

### Activity Plan
```json
{
  "id": "unique_id",
  "patientId": "patient_id",
  "diet": "diet_recommendations",
  "exercise": "exercise_recommendations",
  "medication": "medication_recommendations",
  "doctorId": "doctor_id",
  "createdAt": "timestamp"
}
```

## Customization and Future Enhancements

### Replacing Dummy Data
The application uses LocalStorage for demo persistence. The X-ray severity analysis is performed by the backend model (no dummy analysis output). To integrate with real systems:

1. **Database Integration:**
   - Replace LocalStorage with proper database (PostgreSQL, MySQL, MongoDB)
   - Update JavaScript to use API calls instead of local storage

2. **Authentication:**
   - Implement proper user authentication (JWT, OAuth)
   - Add password hashing and security measures

3. **Image Processing:**
   - Enhance Octave scripts for more accurate analysis
   - Implement machine learning models for better classification
   - Add support for DICOM format

4. **Real-time Features:**
   - Add WebSocket support for real-time updates
   - Implement notification system
   - Add video consultation capabilities

### Security Considerations
- Implement HTTPS for secure data transmission
- Add input validation and sanitization
- Implement rate limiting for API endpoints
- Add audit logging for sensitive operations

## Troubleshooting

### Common Issues

1. **"TypeError: Failed to fetch" (Upload X-Rays):**
   - Ensure the backend is running and reachable:
     - `http://127.0.0.1:5000/api/health`
   - If you opened the frontend directly from disk (`file:///...`), the backend allows `Origin: null`, but you must restart the backend after changes.
   - Prefer using `127.0.0.1` instead of `localhost` (some systems resolve `localhost` to IPv6 `::1`).

2. **Model not loaded (`model.h5` not found):**
   - Ensure `backend/model.h5` exists.
   - Start the server from `backend/` or use:
     - `python "C:\\Users\\HP\\Desktop\\08042026\\Arthrosheild\\backend\\app.py"`

3. **CORS Issues:**
   - Ensure backend is running when testing frontend
   - Check browser console for CORS errors

4. **File Upload Problems:**
   - Verify file size limits
   - Check supported file formats

### Debug Mode
Enable debug mode in Flask for detailed error messages:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## Contributing

This project is designed for educational and demonstration purposes. For production use, consider:

1. Adding comprehensive error handling
2. Implementing proper logging
3. Adding unit and integration tests
4. Setting up CI/CD pipeline
5. Implementing proper security measures

## License

This project is provided as-is for educational purposes. Please ensure compliance with healthcare regulations and data protection laws when deploying in production environments.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the API documentation
3. Verify all prerequisites are properly installed
4. Test with the provided dummy data first

---

**Note:** This application is designed for demonstration purposes and should not be used for actual medical diagnosis without proper validation and regulatory approval.
