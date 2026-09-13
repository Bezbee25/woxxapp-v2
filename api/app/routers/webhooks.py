from fastapi import APIRouter

router = APIRouter(tags=["Webhooks"])

@router.post("/stripe")
async def stripe_webhook():
    return {"message": "Webhook received"}
