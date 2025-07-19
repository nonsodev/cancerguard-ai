from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import aiofiles
from datetime import datetime

from app.core.database import get_db
from app.core.config import settings
from app.models.models import Prediction, User
from app.services.ml_service import ml_service
from app.api.deps import get_current_user
from app.schemas.prediction import PredictionCreate, PredictionResponse

router = APIRouter()

@router.post("/upload", response_model=PredictionResponse)
async def upload_and_predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload an image and get AI prediction for breast cancer detection"""
    
    # Validate file type
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    file_size = 0
    content = await file.read()
    file_size = len(content)
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    try:
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Validate image
        if not ml_service.validate_image(file_path):
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
        
        # Make prediction
        prediction_result = ml_service.predict(file_path)
        
        if "error" in prediction_result:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Prediction failed: {prediction_result['error']}"
            )
        
        # Save prediction to database
        db_prediction = Prediction(
            user_id=current_user.id,
            image_path=file_path,
            image_filename=file.filename,
            image_size=file_size,
            prediction_result=prediction_result["prediction"],
            confidence_score=prediction_result["confidence"],
            processing_time=prediction_result["processing_time"]
        )
        
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        return PredictionResponse(
            id=db_prediction.id,
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            processing_time=prediction_result["processing_time"],
            probabilities=prediction_result["probabilities"],
            image_filename=file.filename,
            created_at=db_prediction.created_at
        )
        
    except Exception as e:
        # Clean up file if something goes wrong
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}"
        )

@router.get("/history", response_model=List[PredictionResponse])
def get_prediction_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get prediction history for the current user"""
    predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [
        PredictionResponse(
            id=pred.id,
            prediction=pred.prediction_result,
            confidence=pred.confidence_score,
            processing_time=pred.processing_time,
            probabilities={
                "Benign": 1 - pred.confidence_score if pred.prediction_result == "Malignant" else pred.confidence_score,
                "Malignant": pred.confidence_score if pred.prediction_result == "Malignant" else 1 - pred.confidence_score
            },
            image_filename=pred.image_filename,
            created_at=pred.created_at
        )
        for pred in predictions
    ]

@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific prediction by ID"""
    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return PredictionResponse(
        id=prediction.id,
        prediction=prediction.prediction_result,
        confidence=prediction.confidence_score,
        processing_time=prediction.processing_time,
        probabilities={
            "Benign": 1 - prediction.confidence_score if prediction.prediction_result == "Malignant" else prediction.confidence_score,
            "Malignant": prediction.confidence_score if prediction.prediction_result == "Malignant" else 1 - prediction.confidence_score
        },
        image_filename=prediction.image_filename,
        created_at=prediction.created_at
    )