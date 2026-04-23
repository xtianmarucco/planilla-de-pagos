-- ============================================================
-- Planilla de Pagos — complete database setup
-- Run this in the Supabase SQL editor for a clean install.
-- Schema is the source of truth: backend/prisma/schema.prisma
-- ============================================================

-- ENUMS
DO $$ BEGIN
  CREATE TYPE client_type    AS ENUM ('MAYORISTA', 'VIABANA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'OTRO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TABLES
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  type       client_type NOT NULL,
  phone      TEXT,
  address    TEXT,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id             SERIAL PRIMARY KEY,
  client_id      INTEGER        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id        INTEGER        REFERENCES users(id),
  amount         NUMERIC(12, 2) NOT NULL,
  payment_date   DATE           NOT NULL,
  payment_method payment_method NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_payments_client_id   ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_client_date  ON payments(client_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_user_id      ON payments(user_id);
