from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List, Optional
import uuid

from app.database import get_session
from app.models.user import User, UserRole
from app.models.tenant import Tenant
from app.models.settings import SystemSetting
from app.schemas.auth import (
    UserResponse,
    RoleUpdateSchema,
    AssignSalesRepSchema,
    WoxxPaySettingsSchema,
)
from app.middleware.auth import require_roles

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_roles([UserRole.ADMIN]))]
)

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    role: Optional[UserRole] = None,
    db: AsyncSession = Depends(get_session)
):
    query = select(User).order_by(User.created_at.desc())
    if role:
        query = query.where(User.role == role)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: uuid.UUID,
    data: RoleUpdateSchema,
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")

    user.role = data.role
    await db.commit()
    await db.refresh(user)
    return user

@router.patch("/users/{user_id}/assign-sales-rep", response_model=UserResponse)
async def assign_sales_rep(
    user_id: uuid.UUID,
    data: AssignSalesRepSchema,
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")

    if data.sales_rep_id:
        sr_res = await db.execute(select(User).where(User.id == data.sales_rep_id, User.role == UserRole.CHARGE_DAFFAIRE))
        sales_rep = sr_res.scalar_one_or_none()
        if not sales_rep:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Le chargé d'affaires spécifié est introuvable ou n'a pas ce rôle.")

    user.assigned_sales_rep_id = data.sales_rep_id
    await db.commit()
    await db.refresh(user)
    return user

@router.patch("/users/{user_id}/toggle-active", response_model=UserResponse)
async def toggle_user_active(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")

    user.is_active = not user.is_active
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/settings/woxxpay", response_model=WoxxPaySettingsSchema)
async def get_woxxpay_settings(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(SystemSetting).where(SystemSetting.key == "woxxpay"))
    setting = result.scalar_one_or_none()
    if not setting or not setting.value:
        return WoxxPaySettingsSchema()
    return WoxxPaySettingsSchema(**setting.value)

@router.patch("/settings/woxxpay", response_model=WoxxPaySettingsSchema)
async def update_woxxpay_settings(
    data: WoxxPaySettingsSchema,
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(SystemSetting).where(SystemSetting.key == "woxxpay"))
    setting = result.scalar_one_or_none()
    
    if not setting:
        setting = SystemSetting(key="woxxpay", value=data.model_dump())
        db.add(setting)
    else:
        setting.value = data.model_dump()

    await db.commit()
    return data

@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_session)):
    total_clients_res = await db.execute(select(func.count(User.id)).where(User.role == UserRole.CLIENT))
    total_reps_res = await db.execute(select(func.count(User.id)).where(User.role == UserRole.CHARGE_DAFFAIRE))
    total_tenants_res = await db.execute(select(func.count(Tenant.id)))

    return {
        "clients_count": total_clients_res.scalar() or 0,
        "sales_reps_count": total_reps_res.scalar() or 0,
        "tenants_count": total_tenants_res.scalar() or 0,
    }
