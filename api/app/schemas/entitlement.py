from pydantic import BaseModel

class EntitlementActivate(BaseModel):
    module_slug: str
