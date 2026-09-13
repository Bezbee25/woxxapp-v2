from fastapi import APIRouter

router = APIRouter(tags=["Showroom"])

@router.get("/")
async def get_showroom():
    return [
        {"name": "Demo Pizza", "url": "https://demo-pizza.woxxapp.de"},
        {"name": "Demo Mode", "url": "https://demo-mode.woxxapp.de"},
        {"name": "Zorea", "url": "https://zorea.woxxapp.de"}
    ]
