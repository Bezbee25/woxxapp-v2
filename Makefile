.PHONY: dev-api dev-web build migrate

dev-api:
	cd api && uvicorn app.main:app --reload

dev-web:
	cd web && npm run dev

build:
	cd api && docker build -t woxxapp-api .
	cd web && docker build -t woxxapp-web .

migrate:
	cd api && alembic upgrade head
