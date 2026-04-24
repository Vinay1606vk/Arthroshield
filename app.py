#!/usr/bin/env python3
"""
ARTHROSHIELD Backend Server
Handles X-ray image processing and analysis using Keras/TensorFlow ML model
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import base64
import json
from datetime import datetime
import tempfile
import shutil
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow import keras

app = Flask(__name__)

# Allow browser clients opened from disk (Origin: null) and local dev servers
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=False,
)

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
PROCESSED_FOLDER = os.path.join(BASE_DIR, 'processed')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'dicom', 'dcm'}
MODEL_PATH = os.path.join(BASE_DIR, 'model.h5')

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Load the Keras model
print("Loading Keras model...")
try:
    model = keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully!")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Model will not be available. Please ensure model.h5 exists.")
    model = None

# Class labels mapping
CLASS_LABELS = ['Normal', 'Severe', 'Moderate', 'Mild', 'Doubtful']

# Severity mapping from class to severity level
def map_class_to_severity(class_idx):
    """Map model class index to severity level"""
    if class_idx == 0:  # Normal
        return 'low', 0.90
    elif class_idx == 1:  # Severe
        return 'high', 0.92
    elif class_idx == 2:  # Moderate
        return 'medium', 0.85
    elif class_idx == 3:  # Mild
        return 'medium', 0.82
    elif class_idx == 4:  # Doubtful
        return 'low', 0.78
    else:
        return 'medium', 0.80

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_base64_image(base64_string, filename):
    """Save base64 encoded image to file"""
    # Remove data URL prefix if present
    if 'base64,' in base64_string:
        base64_string = base64_string.split('base64,')[1]
    
    image_data = base64.b64decode(base64_string)
    
    with open(filename, 'wb') as f:
        f.write(image_data)
    
    return filename

def preprocess_image(image_path):
    """Preprocess X-ray image for Keras model analysis"""
    try:
        # Open image
        img = Image.open(image_path)
        
        # Convert to grayscale
        if img.mode != 'L':
            img = img.convert('L')
        
        # Resize to model input size (256x256)
        img = img.resize((256, 256))
        
        # Save preprocessed image
        processed_path = image_path.replace('.', '_processed.')
        img.save(processed_path)
        
        return processed_path
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return image_path

def preprocess_for_model(image_path):
    """Preprocess image for Keras model prediction"""
    try:
        # Open image
        img = Image.open(image_path)
        
        # Convert to grayscale
        if img.mode != 'L':
            img = img.convert('L')
        
        # Resize to 256x256
        img = img.resize((256, 256))
        
        # Convert to numpy array and normalize
        img_array = np.array(img) / 255.0
        
        # Add batch and channel dimensions (256, 256, 1)
        img_array = np.expand_dims(img_array, axis=-1)  # Add channel
        img_array = np.expand_dims(img_array, axis=0)  # Add batch
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing for model: {e}")
        return None

def analyze_with_model(image_path):
    """Analyze X-ray using Keras/TensorFlow model for knee osteoarthritis"""
    try:
        if model is None:
            print("Model not loaded. Analysis cannot be performed.")
            return None
        
        # Preprocess image for model
        img_array = preprocess_for_model(image_path)
        
        if img_array is None:
            print("Image preprocessing failed. Analysis cannot be performed.")
            return None
        
        # Make prediction
        print("Running model prediction...")
        predictions = model.predict(img_array, verbose=0)
        
        # Get predicted class and confidence
        predicted_class = np.argmax(predictions[0])
        class_confidence = float(predictions[0][predicted_class])
        
        # Get all class probabilities
        class_probabilities = {CLASS_LABELS[i]: float(predictions[0][i]) for i in range(5)}
        
        print(f"Predicted class: {CLASS_LABELS[predicted_class]} (confidence: {class_confidence:.2f})")
        
        # Map class to severity level
        severity, base_confidence = map_class_to_severity(predicted_class)
        
        # Use the higher of model confidence or base confidence
        final_confidence = max(class_confidence, base_confidence)
        
        # Prepare comprehensive results
        results = {
            'severity': severity,
            'confidence': round(final_confidence, 2),
            'predicted_class': CLASS_LABELS[predicted_class],
            'class_index': int(predicted_class),
            'class_probabilities': class_probabilities,
            'analysis_method': 'keras_model',
            'model_input_shape': list(model.input_shape[1:])
        }
        
        return results
        
    except Exception as e:
        print(f"Error in model analysis: {e}")
        return None

@app.route('/api/analyze-xray', methods=['POST'])
def analyze_xray():
    """Analyze X-ray image and return results"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data or 'patientId' not in data:
            return jsonify({'error': 'Missing required data'}), 400
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.png"
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save image
        save_base64_image(data['image'], image_path)
        
        # Preprocess image
        processed_path = preprocess_image(image_path)
        
        # Analyze with Keras Model
        results = analyze_with_model(processed_path)
        
        if results is None:
            return jsonify({'error': 'Analysis failed'}), 500
        
        # Add metadata
        results.update({
            'patientId': data['patientId'],
            'analysisDate': datetime.now().isoformat(),
            'imagePath': processed_path
        })
        
        # Clean up temporary files
        try:
            os.remove(image_path)
            os.remove(processed_path)
        except:
            pass
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        print(f"Error analyzing X-ray: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH if model else None
    })

@app.route('/api/test-model', methods=['GET'])
def test_model():
    """Test Keras model connectivity"""
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded. Please ensure model.h5 exists.'
            }), 500
        
        # Get model info
        model_info = {
            'success': True,
            'model_loaded': True,
            'input_shape': list(model.input_shape),
            'output_shape': list(model.output_shape),
            'num_classes': model.output_shape[-1],
            'class_labels': CLASS_LABELS,
            'model_path': MODEL_PATH
        }
        
        return jsonify(model_info)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("Starting ARTHROSHIELD Backend Server (Keras Model)")
    print("=" * 60)
    print("Server will be available at: http://localhost:5000")
    print("")
    print("API Endpoints:")
    print("  POST /api/analyze-xray - Analyze X-ray image with ML model")
    print("  GET  /api/health       - Health check")
    print("  GET  /api/test-model   - Test model connectivity")
    print("")
    if model is None:
        print("WARNING: Model not loaded! Analysis will fail until a valid model is provided.")
        print(f"Expected model file: {MODEL_PATH}")
    else:
        print(f"Model loaded: {MODEL_PATH}")
        print(f"Model input shape: {model.input_shape}")
        print(f"Classes: {', '.join(CLASS_LABELS)}")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
