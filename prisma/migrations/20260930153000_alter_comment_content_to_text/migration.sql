-- AlterTable
ALTER TABLE "comentario" ALTER COLUMN "conteudo" TYPE TEXT;

-- Self-healing for any subcomments with null id_desabafo
UPDATE "comentario"
SET "id_desabafo" = parent."id_desabafo"
FROM "comentario" parent
WHERE "comentario"."id_subcomentario" = parent."id"
  AND "comentario"."id_desabafo" IS NULL
  AND parent."id_desabafo" IS NOT NULL;
