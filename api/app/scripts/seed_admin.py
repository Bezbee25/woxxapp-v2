import asyncio
import sys
from sqlalchemy.future import select

from app.database import async_session, engine, Base
from app.models.user import User, UserRole
from app.services.auth import hash_password
from app.config import settings

async def seed_admin():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        email = settings.ADMIN_INITIAL_EMAIL.lower()
        result = await session.execute(select(User).where(User.email == email))
        admin = result.scalar_one_or_none()

        if not admin:
            admin = User(
                email=email,
                password_hash=hash_password(settings.ADMIN_INITIAL_PASSWORD),
                full_name="Administrateur WoxxApp",
                role=UserRole.ADMIN,
                is_active=True
            )
            session.add(admin)
            await session.commit()
            print(f"✅ Administrateur initial créé avec succès : {email}")
        else:
            admin.role = UserRole.ADMIN
            admin.is_active = True
            await session.commit()
            print(f"ℹ️ Le compte administrateur existe déjà : {email}")

if __name__ == "__main__":
    asyncio.run(seed_admin())
