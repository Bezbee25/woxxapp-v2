import enum
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CHARGE_DAFFAIRE = "charge_daffaire"
    CLIENT = "client"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    role = Column(Enum(UserRole, name="user_role"), default=UserRole.CLIENT, nullable=False, index=True)
    google_id = Column(String, unique=True, nullable=True)
    assigned_sales_rep_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    sales_rep = relationship("User", remote_side=[id], backref="assigned_clients")
    tenants = relationship("Tenant", back_populates="user", cascade="all, delete-orphan")
