from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class PredictionBase(BaseModel):
    prediction: str
    confidence: float

class PredictionCreate(PredictionBase):
    image_path: str
    processing_time: Optional[float] = None

class PredictionResponse(BaseModel):
    id: int
    prediction: str
    confidence: float
    processing_time: Optional[float] = None
    probabilities: Dict[str, float]
    image_filename: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True