from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.schemas.auth import UserRegister, UserLogin, Token
from app.models.tenant import Tenant
from app.services.auth import hash_password, verify_password, create_jwt
from sqlalchemy import select

router = APIRouter(tags=["Auth"])

@router.post("/register", response_model=Token)
async def register(user: UserRegister, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Tenant).where(Tenant.email == user.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_tenant = Tenant(
        email=user.email,
        password_hash=hash_password(user.password),
        commerce_name=user.commerce_name,
        subdomain=user.subdomain
    )
    db.add(new_tenant)
    await db.commit()
    await db.refresh(new_tenant)
    
    return {"access_token": create_jwt(str(new_tenant.id)), "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Tenant).where(Tenant.email == user.email))
    tenant = result.scalars().first()
    if not tenant or not verify_password(user.password, tenant.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return {"access_token": create_jwt(str(tenant.id)), "token_type": "bearer"}

@router.get("/me")
async def get_me():
    return {"message": "Not implemented yet, use JWTBearer middleware"}
