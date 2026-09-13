from fastapi import APIRouter

router = APIRouter(tags=["Tenants"])

@router.get("/me")
async def get_tenant_me():
    return {"message": "Tenant details"}
