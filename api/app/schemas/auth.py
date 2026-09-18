from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime
import uuid
from app.models.user import UserRole

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: Optional[str] = None
    role: UserRole
    google_id: Optional[str] = None
    assigned_sales_rep_id: Optional[uuid.UUID] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class RoleUpdateSchema(BaseModel):
    role: UserRole

class AssignSalesRepSchema(BaseModel):
    sales_rep_id: Optional[uuid.UUID] = None

class WoxxPaySettingsSchema(BaseModel):
    api_url: str = "https://pay.woxxapp.de"
    merchant_token: str = ""
    webhook_secret: Optional[str] = ""
    default_commission_percent: float = 2.0
    is_enabled: bool = True
