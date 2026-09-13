from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://woxxapp:CHANGE_ME_WOXXAPP_PASSWORD@localhost/woxxapp"
    STRIPE_SECRET_KEY: str = "sk_test_..."
    JWT_SECRET: str = "supersecretjwt"
    SUBDOMAIN_BASE: str = "woxxapp.de"

    class Config:
        env_file = ".env"

settings = Settings()
