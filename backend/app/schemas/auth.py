from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.schemas.user import UserResponse

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse