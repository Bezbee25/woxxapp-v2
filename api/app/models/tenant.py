from sqlalchemy import Column, String, Boolean, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    commerce_name = Column(String, nullable=False)
    subdomain = Column(String, unique=True, nullable=False)
    custom_domain = Column(String)
    status = Column(String, default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Module(Base):
    __tablename__ = "modules"
    slug = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    requires_module_slug = Column(String, ForeignKey("modules.slug"))
    price_monthly_cents = Column(Integer, default=0)
    price_yearly_cents = Column(Integer, default=0)
    commission_percent = Column(Numeric(4, 2), default=0)

class Entitlement(Base):
    __tablename__ = "entitlements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    module_slug = Column(String, ForeignKey("modules.slug"), nullable=False)
    enabled_by_tenant = Column(Boolean, default=False)
    stripe_item_id = Column(String)
    activated_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
