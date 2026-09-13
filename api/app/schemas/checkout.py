from pydantic import BaseModel

class CheckoutRequest(BaseModel):
    module_slug: str
    billing_cycle: str
