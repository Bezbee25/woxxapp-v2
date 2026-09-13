CREATE USER woxxapp WITH PASSWORD 'WoxxAppPasswordChangeMe2026!';
CREATE DATABASE woxxapp OWNER woxxapp;
\c woxxapp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE tenant_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE provisioning_status AS ENUM ('pending', 'running', 'success', 'failed');
CREATE TYPE setup_status AS ENUM ('pending', 'quoted', 'in_progress', 'done');

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    commerce_name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    custom_domain TEXT,
    status tenant_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE modules (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    requires_module_slug TEXT REFERENCES modules(slug),
    price_monthly_cents INT NOT NULL DEFAULT 0,
    price_yearly_cents INT NOT NULL DEFAULT 0,
    commission_percent NUMERIC(4,2) NOT NULL DEFAULT 0
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    module_slug TEXT NOT NULL REFERENCES modules(slug),
    enabled_by_tenant BOOLEAN NOT NULL DEFAULT false,
    stripe_item_id TEXT,
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    UNIQUE(tenant_id, module_slug)
);

CREATE TABLE setup_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    description TEXT,
    status setup_status NOT NULL DEFAULT 'pending',
    quoted_amount_cents INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE provisioning_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL,
    status provisioning_status NOT NULL DEFAULT 'pending',
    payload JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_entitlements_tenant ON entitlements(tenant_id);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_provisioning_tenant ON provisioning_jobs(tenant_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER provisioning_updated_at BEFORE UPDATE ON provisioning_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Modules initiaux
INSERT INTO modules (slug, name, description, requires_module_slug, price_monthly_cents, price_yearly_cents, commission_percent) VALUES
('vitrine', 'Site Vitrine & Click & Collect', 'Site web professionnel, horaires, galerie, formulaire contact, Click & Collect', NULL, 1500, 15000, 0),
('ecommerce', 'Vente de Produits', 'Catalogue illimité, panier, gestion des stocks et variantes', 'vitrine', 3000, 30000, 0),
('payment', 'Paiement en ligne (WoxxPay/Stripe)', 'Encaissement CB, Apple Pay, Google Pay sécurisé', 'ecommerce', 0, 0, 2.00),
('shipping', 'Transport & Expédition (WoxxShip)', 'Sendcloud, Colissimo, Mondial Relay, étiquettes automatiques', 'ecommerce', 3000, 30000, 0),
('food_delivery', 'Livraison Fast-Food', 'Intégration UberEats / Deliveroo', 'vitrine', 3000, 30000, 0),
('custom_domain', 'Nom de Domaine Personnalisé', 'Branchez votre propre domaine (www.mon-commerce.fr)', 'vitrine', 0, 0, 0),
('setup_support', 'Accompagnement & Setup', 'Mise en page, catalogue, Stripe, SendCloud, formation', NULL, 0, 0, 0);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO woxxapp;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO woxxapp;
