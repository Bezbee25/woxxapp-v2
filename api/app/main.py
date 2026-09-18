from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.routers import auth, admin, sales_rep, tenants, entitlements, checkout, webhooks, showroom
from app.scripts.seed_admin import seed_admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Création automatique des tables et seed de l'admin initial
    try:
        await seed_admin()
    except Exception as e:
        print(f"Notice DB initialization/seed: {e}")
    yield
    await engine.dispose()

app = FastAPI(title="WoxxApp V2 API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://woxxapp.de", "https://*.woxxapp.de"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(sales_rep.router, prefix="/api/v1")
app.include_router(tenants.router, prefix="/api/v1/tenants")
app.include_router(entitlements.router, prefix="/api/v1/entitlements")
app.include_router(checkout.router, prefix="/api/v1/checkout")
app.include_router(webhooks.router, prefix="/api/v1/webhooks")
app.include_router(showroom.router, prefix="/api/v1/showroom")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "woxxapp-api", "version": "2.0.0"}
