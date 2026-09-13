from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.routers import auth, tenants, entitlements, checkout, webhooks, showroom

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB (if not using alembic for initial setup, uncomment next line)
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(title="WoxxApp API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(tenants.router, prefix="/api/v1/tenants")
app.include_router(entitlements.router, prefix="/api/v1/entitlements")
app.include_router(checkout.router, prefix="/api/v1/checkout")
app.include_router(webhooks.router, prefix="/api/v1/webhooks")
app.include_router(showroom.router, prefix="/api/v1/showroom")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "woxxapp-api", "version": "1.0.0"}
