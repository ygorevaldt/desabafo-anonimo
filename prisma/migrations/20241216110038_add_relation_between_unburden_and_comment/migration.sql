-- AlterTable
ALTER TABLE "apoio" ALTER COLUMN "session_id" SET DEFAULT gen_random_uuid()::TEXT;

-- AlterTable
ALTER TABLE "comentario" ADD COLUMN     "id_desabafo" UUID;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_desabafo_fkey" FOREIGN KEY ("id_desabafo") REFERENCES "desabafo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
