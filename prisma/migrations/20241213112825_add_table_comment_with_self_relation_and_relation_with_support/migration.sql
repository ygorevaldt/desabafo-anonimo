/*
  Warnings:

  - Added the required column `id_comentario` to the `apoio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apoio" ADD COLUMN     "id_comentario" UUID NOT NULL,
ALTER COLUMN "session_id" SET DEFAULT gen_random_uuid()::TEXT;

-- CreateTable
CREATE TABLE "comentario" (
    "id" UUID NOT NULL,
    "conteudo" VARCHAR(1500) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_subcomentario" UUID,

    CONSTRAINT "comentario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apoio" ADD CONSTRAINT "apoio_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "comentario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_subcomentario_fkey" FOREIGN KEY ("id_subcomentario") REFERENCES "comentario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
