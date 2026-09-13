from pydantic import BaseModel
from uuid import UUID

class TenantResponse(BaseModel):
    id: UUID
    email: str
    commerce_name: str
    subdomain: str
    status: str

    class Config:
        from_attributes = True
