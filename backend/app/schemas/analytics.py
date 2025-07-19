from pydantic import BaseModel

class AnalyticsResponse(BaseModel):
    total_predictions: int
    total_users: int
    benign_predictions: int
    malignant_predictions: int
    average_processing_time: float
    recent_predictions: int

class UserStatsResponse(BaseModel):
    total_predictions: int
    benign_predictions: int
    malignant_predictions: int
    average_confidence: float