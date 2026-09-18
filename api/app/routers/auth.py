from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import urllib.parse
import secrets

from app.database import get_session
from app.config import settings
from app.models.user import User, UserRole
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services.auth import (
    hash_password,
    verify_password,
    create_jwt,
    exchange_google_code_for_tokens,
    get_google_user_info,
)
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register(
    data: UserRegister,
    response: Response,
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).where(User.email == data.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette adresse email est déjà enregistrée."
        )

    new_user = User(
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        full_name=data.full_name or data.email.split("@")[0],
        role=UserRole.CLIENT,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_jwt(str(new_user.id), new_user.email, new_user.role.value)
    
    # Cookie session HttpOnly
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=settings.WOXXAPP_MAIN_DOMAIN != "localhost",
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/"
    )

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(
    data: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).where(User.email == data.email.lower()))
    user = result.scalar_one_or_none()

    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects (email ou mot de passe invalide)."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Votre compte a été désactivé."
        )

    token = create_jwt(str(user.id), user.email, user.role.value)

    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=settings.WOXXAPP_MAIN_DOMAIN != "localhost",
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/"
    )

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )

@router.get("/google")
async def google_auth_redirect():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth n'est pas encore configuré."
        )

    state = secrets.token_urlsafe(16)
    redirect_uri = f"{settings.FRONTEND_URL}/api/v1/auth/google/callback"
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "online",
        "prompt": "select_account",
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=url)

@router.get("/google/callback")
async def google_auth_callback(
    code: str,
    state: str,
    response: Response,
    db: AsyncSession = Depends(get_session)
):
    redirect_uri = f"{settings.FRONTEND_URL}/api/v1/auth/google/callback"
    tokens = await exchange_google_code_for_tokens(code, redirect_uri)
    if not tokens or "access_token" not in tokens:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}?error=oauth_failed")

    google_user = await get_google_user_info(tokens["access_token"])
    if not google_user or "email" not in google_user:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}?error=userinfo_failed")

    email = google_user["email"].lower()
    google_id = google_user.get("sub")
    full_name = google_user.get("name") or google_user.get("given_name")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # Création automatique de compte avec rôle client
        user = User(
            email=email,
            full_name=full_name,
            google_id=google_id,
            role=UserRole.CLIENT,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        if not user.google_id and google_id:
            user.google_id = google_id
            await db.commit()
            await db.refresh(user)

    token = create_jwt(str(user.id), user.email, user.role.value)

    res = RedirectResponse(url=f"{settings.FRONTEND_URL}?auth_success=1")
    res.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=settings.WOXXAPP_MAIN_DOMAIN != "localhost",
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/"
    )
    return res

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="session", path="/")
    return {"message": "Déconnexion réussie."}
