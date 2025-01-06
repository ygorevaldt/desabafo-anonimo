-- AlterTable
ALTER TABLE "apoio" ALTER COLUMN "session_id" SET DEFAULT gen_random_uuid()::TEXT;

-- AlterTable
ALTER TABLE "desabafo" ADD COLUMN     "conteudo_sensivel" BOOLEAN DEFAULT false;
