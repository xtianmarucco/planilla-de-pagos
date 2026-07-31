-- Create user_role enum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'USER');

-- Add role and is_active to users
ALTER TABLE "users" ADD COLUMN "role"      "user_role" NOT NULL DEFAULT 'USER';
ALTER TABLE "users" ADD COLUMN "is_active" BOOLEAN     NOT NULL DEFAULT true;
