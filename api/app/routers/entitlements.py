from fastapi import APIRouter

router = APIRouter(tags=["Entitlements"])

@router.get("/{id}")
async def get_entitlements(id: str):
    return {"message": f"Entitlements for {id}"}

@router.post("/activate")
async def activate_entitlement():
    return {"message": "Activate entitlement"}
