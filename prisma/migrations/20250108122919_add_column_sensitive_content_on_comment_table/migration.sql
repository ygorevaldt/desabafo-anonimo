-- AlterTable
ALTER TABLE "apoio" ALTER COLUMN "session_id" SET DEFAULT gen_random_uuid()::TEXT;

-- AlterTable
ALTER TABLE "comentario" ADD COLUMN     "conteudo_sensivel" BOOLEAN DEFAULT false;
