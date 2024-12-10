-- AlterTable
ALTER TABLE "apoio" ADD COLUMN     "session_id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::TEXT;
