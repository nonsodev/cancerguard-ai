from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from app.core.database import get_db
from app.models.models import Prediction, User
from app.api.deps import get_current_user
from app.schemas.analytics import AnalyticsResponse, UserStatsResponse

router = APIRouter()

@router.get("/dashboard", response_model=AnalyticsResponse)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard analytics data"""
    
    # Total predictions
    total_predictions = db.query(Prediction).count()
    
    # Total users
    total_users = db.query(User).count()
    
    # Prediction distribution
    benign_count = db.query(Prediction).filter(
        Prediction.prediction_result == "Benign"
    ).count()
    
    malignant_count = db.query(Prediction).filter(
        Prediction.prediction_result == "Malignant"
    ).count()
    
    # Average processing time
    avg_processing_time = db.query(
        func.avg(Prediction.processing_time)
    ).scalar() or 0.0
    
    # Recent predictions (last 7 days)
    from datetime import datetime, timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_predictions = db.query(Prediction).filter(
        Prediction.created_at >= week_ago
    ).count()
    
    return AnalyticsResponse(
        total_predictions=total_predictions,
        total_users=total_users,
        benign_predictions=benign_count,
        malignant_predictions=malignant_count,
        average_processing_time=round(avg_processing_time, 3),
        recent_predictions=recent_predictions
    )

@router.get("/user-stats", response_model=UserStatsResponse)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's statistics"""
    
    # User's total predictions
    user_predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).count()
    
    # User's prediction distribution
    user_benign = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.prediction_result == "Benign"
    ).count()
    
    user_malignant = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.prediction_result == "Malignant"
    ).count()
    
    # User's average confidence
    avg_confidence = db.query(
        func.avg(Prediction.confidence_score)
    ).filter(
        Prediction.user_id == current_user.id
    ).scalar() or 0.0
    
    return UserStatsResponse(
        total_predictions=user_predictions,
        benign_predictions=user_benign,
        malignant_predictions=user_malignant,
        average_confidence=round(avg_confidence, 3)
    )