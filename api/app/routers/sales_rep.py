from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List

from app.database import get_session
from app.models.user import User, UserRole
from app.schemas.auth import UserResponse
from app.middleware.auth import require_roles, get_current_user

router = APIRouter(
    prefix="/sales-rep",
    tags=["Sales Representative"],
    dependencies=[Depends(require_roles([UserRole.CHARGE_DAFFAIRE, UserRole.ADMIN]))]
)

@router.get("/clients", response_model=List[UserResponse])
async def list_assigned_clients(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    query = select(User).where(User.assigned_sales_rep_id == current_user.id).order_by(User.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/stats")
async def get_sales_rep_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    count_res = await db.execute(
        select(func.count(User.id)).where(User.assigned_sales_rep_id == current_user.id)
    )
    return {
        "assigned_clients_count": count_res.scalar() or 0
    }
