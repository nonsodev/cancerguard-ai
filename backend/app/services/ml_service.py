import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from PIL import Image
import os
import time
from typing import Tuple, Dict
from app.core.config import settings

class MLService:
    def __init__(self):
        self.model = None
        self.class_labels = {0: "Benign", 1: "Malignant"}
        self.load_model()
    
    def load_model(self):
        """Load the pre-trained CNN-RNN model"""
        try:
            if os.path.exists(settings.MODEL_PATH):
                self.model = load_model(settings.MODEL_PATH)
                print(f"Model loaded successfully from {settings.MODEL_PATH}")
            else:
                print(f"Model file not found at {settings.MODEL_PATH}")
                # For development, create a dummy model
                self.model = self._create_dummy_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = self._create_dummy_model()
    
    def _create_dummy_model(self):
        """Create a dummy model for development/testing"""
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Dense, Input
        
        model = Sequential([
            Input(shape=(settings.MODEL_SEQUENCE_LENGTH, settings.MODEL_INPUT_SIZE, settings.MODEL_INPUT_SIZE, 3)),
            tf.keras.layers.Flatten(),
            Dense(64, activation='relu'),
            Dense(2, activation='softmax')
        ])
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        return model
    
    def preprocess_single_image(self, image_path: str, target_size: Tuple[int, int] = None) -> np.ndarray:
        """
        Preprocess a single image for the model.
        
        Args:
            image_path: Path to the image file
            target_size: Target size for resizing the image
            
        Returns:
            Preprocessed image array
        """
        if target_size is None:
            target_size = (settings.MODEL_INPUT_SIZE, settings.MODEL_INPUT_SIZE)
        
        # Load and resize the image
        image = load_img(image_path, target_size=target_size)
        # Convert to numpy array and normalize
        image_array = img_to_array(image) / 255.0
        
        return image_array
    
    def prepare_sequence_input(self, image_path: str, sequence_length: int = None, target_size: Tuple[int, int] = None) -> np.ndarray:
        """
        Prepare input to match the model's expected shape.
        
        Args:
            image_path: Path to the image file
            sequence_length: Length of the sequence
            target_size: Target size for resizing
            
        Returns:
            Input array of shape (1, sequence_length, height, width, channels)
        """
        if sequence_length is None:
            sequence_length = settings.MODEL_SEQUENCE_LENGTH
        if target_size is None:
            target_size = (settings.MODEL_INPUT_SIZE, settings.MODEL_INPUT_SIZE)
        
        # Preprocess the single image
        image_array = self.preprocess_single_image(image_path, target_size)
        
        # Duplicate the image to create a sequence
        sequence_input = np.stack([image_array] * sequence_length, axis=0)
        
        # Add batch dimension
        sequence_input = np.expand_dims(sequence_input, axis=0)
        
        return sequence_input
    
    def predict(self, image_path: str) -> Dict:
        """
        Make a prediction on a single image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary containing prediction results
        """
        start_time = time.time()
        
        try:
            # Prepare the sequence input
            sequence_input = self.prepare_sequence_input(image_path)
            
            # Make a prediction
            prediction = self.model.predict(sequence_input, verbose=0)
            
            # Get the class with the highest probability
            predicted_class_index = np.argmax(prediction, axis=1)[0]
            confidence_score = float(np.max(prediction))
            predicted_class = self.class_labels[predicted_class_index]
            
            processing_time = time.time() - start_time
            
            return {
                "prediction": predicted_class,
                "confidence": confidence_score,
                "processing_time": processing_time,
                "probabilities": {
                    "Benign": float(prediction[0][0]),
                    "Malignant": float(prediction[0][1])
                }
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "prediction": None,
                "confidence": 0.0,
                "processing_time": time.time() - start_time
            }
    
    def validate_image(self, image_path: str) -> bool:
        """
        Validate if the image can be processed.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            True if valid, False otherwise
        """
        try:
            with Image.open(image_path) as img:
                # Check if image can be opened and has valid format
                img.verify()
                return True
        except Exception:
            return False

# Global ML service instance
ml_service = MLService()