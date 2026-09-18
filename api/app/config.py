import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = ""
    WOXXAPP_DATABASE_URL: str = ""
    
    WOXXAPP_DATABASE_HOST: str = "shared-postgres.database-system.svc.cluster.local"
    WOXXAPP_DATABASE_PORT: str = "5432"
    WOXXAPP_DATABASE_USER: str = "woxxapp"
    WOXXAPP_DATABASE_PASSWORD: str = "WoxxAppPasswordChangeMe2026!"
    WOXXAPP_DATABASE_NAME: str = "woxxapp"
    
    WOXXAPP_JWT_SECRET_KEY: str = "dev_woxxapp_jwt_secret_mock_local_test_1234567890"
    JWT_SECRET: str = "dev_woxxapp_jwt_secret_mock_local_test_1234567890"
    
    WOXXAPP_STRIPE_SECRET_KEY: str = "sk_test_mock"
    STRIPE_SECRET_KEY: str = "sk_test_mock"
    
    WOXXAPP_SUBDOMAIN_BASE: str = "127.0.0.1.nip.io"
    SUBDOMAIN_BASE: str = "127.0.0.1.nip.io"
    
    WOXXAPP_K8S_NAMESPACE_PREFIX: str = "tenant-"
    K8S_NAMESPACE_PREFIX: str = "tenant-"
    
    # OAuth & Frontend URL
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    WOXXAPP_MAIN_DOMAIN: str = "localhost"

    # Initial Admin Seed
    ADMIN_INITIAL_EMAIL: str = "admin@woxxapp.de"
    ADMIN_INITIAL_PASSWORD: str = "WoxxAdminSecure2026!"

    @property
    def db_url(self) -> str:
        if self.WOXXAPP_DATABASE_URL:
            return self.WOXXAPP_DATABASE_URL
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.WOXXAPP_DATABASE_USER}:{self.WOXXAPP_DATABASE_PASSWORD}@{self.WOXXAPP_DATABASE_HOST}:{self.WOXXAPP_DATABASE_PORT}/{self.WOXXAPP_DATABASE_NAME}"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
# S'assurer que DATABASE_URL est toujours renseigné
if not settings.DATABASE_URL:
    settings.DATABASE_URL = settings.db_url
