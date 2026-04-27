-- Add CUENTA_CORRIENTE to payment_method enum
ALTER TYPE "payment_method" ADD VALUE 'CUENTA_CORRIENTE';

-- Create payment_status enum
CREATE TYPE "payment_status" AS ENUM ('PAGADO', 'PENDIENTE');

-- Create sucursales table
CREATE TABLE "sucursales" (
    "id"         SERIAL        NOT NULL,
    "client_id"  INTEGER       NOT NULL,
    "name"       TEXT          NOT NULL,
    "address"    TEXT,
    "phone"      TEXT,
    "is_active"  BOOLEAN       NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "sucursales"
    ADD CONSTRAINT "sucursales_client_id_fkey"
    FOREIGN KEY ("client_id") REFERENCES "clients"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "idx_sucursales_client_id" ON "sucursales"("client_id");

-- Add status and sucursal_id to payments
ALTER TABLE "payments" ADD COLUMN "status"       "payment_status" NOT NULL DEFAULT 'PAGADO';
ALTER TABLE "payments" ADD COLUMN "sucursal_id"  INTEGER;

ALTER TABLE "payments"
    ADD CONSTRAINT "payments_sucursal_id_fkey"
    FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

CREATE INDEX "idx_payments_sucursal_id" ON "payments"("sucursal_id");
CREATE INDEX "idx_payments_status"      ON "payments"("status");
