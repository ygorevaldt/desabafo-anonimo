-- DropForeignKey
ALTER TABLE "apoio" DROP CONSTRAINT "apoio_id_comentario_fkey";

-- DropForeignKey
ALTER TABLE "apoio" DROP CONSTRAINT "apoio_id_desabafo_fkey";

-- AlterTable
ALTER TABLE "apoio" ALTER COLUMN "id_desabafo" DROP NOT NULL,
ALTER COLUMN "session_id" SET DEFAULT gen_random_uuid()::TEXT,
ALTER COLUMN "id_comentario" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "apoio" ADD CONSTRAINT "apoio_id_desabafo_fkey" FOREIGN KEY ("id_desabafo") REFERENCES "desabafo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apoio" ADD CONSTRAINT "apoio_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "comentario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
