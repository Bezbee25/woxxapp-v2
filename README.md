# WoxxApp V2

Plateforme SaaS permettant à des commerçants d'acheter et gérer un site web vitrine/e-commerce modulaire.

## Structure

- `api/` : Backend FastAPI
- `web/` : Frontend Next.js (App Router)
- `db/` : Schéma d'initialisation PostgreSQL
- `.github/` : CI/CD GitHub Actions

## Commandes locales

- `make dev-api` : Lance le backend sur http://localhost:8000
- `make dev-web` : Lance le frontend sur http://localhost:3000
- `make build` : Construit les images Docker
- `make migrate` : Applique les migrations de la base de données
