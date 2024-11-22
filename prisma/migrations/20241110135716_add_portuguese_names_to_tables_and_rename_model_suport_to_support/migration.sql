/*
  Warnings:

  - You are about to drop the `Suport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Suport" DROP CONSTRAINT "Suport_id_desabafo_fkey";

-- DropTable
DROP TABLE "Suport";

-- DropTable
DROP TABLE "Vent";

-- CreateTable
CREATE TABLE "apoio" (
    "id" UUID NOT NULL,
    "id_desabafo" UUID NOT NULL,

    CONSTRAINT "apoio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desabafo" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(2500) NOT NULL,

    CONSTRAINT "desabafo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apoio" ADD CONSTRAINT "apoio_id_desabafo_fkey" FOREIGN KEY ("id_desabafo") REFERENCES "desabafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
