-- AlterTable
ALTER TABLE "apoio" ALTER COLUMN "session_id" SET DEFAULT gen_random_uuid()::TEXT;
