-- AlterTable
ALTER TABLE "desabafo" ADD COLUMN "deleted_at" TIMESTAMP;

-- CreateTable
CREATE TABLE "denuncia" (
    "id" UUID NOT NULL,
    "session_id" VARCHAR(36) NOT NULL,
    "id_desabafo" UUID NOT NULL,
    "motivo" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "denuncia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "denuncia_session_id_id_desabafo_key" ON "denuncia"("session_id", "id_desabafo");

-- AddForeignKey
ALTER TABLE "denuncia" ADD CONSTRAINT "denuncia_id_desabafo_fkey" FOREIGN KEY ("id_desabafo") REFERENCES "desabafo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
