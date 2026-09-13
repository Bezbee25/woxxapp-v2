from fastapi import APIRouter

router = APIRouter(tags=["Checkout"])

@router.post("/session")
async def create_checkout_session():
    return {"message": "Checkout session created"}
