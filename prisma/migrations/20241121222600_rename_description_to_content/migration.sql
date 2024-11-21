/*
  Warnings:

  - You are about to drop the column `descricao` on the `desabafo` table. All the data in the column will be lost.
  - Added the required column `conteudo` to the `desabafo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "desabafo" DROP COLUMN "descricao",
ADD COLUMN     "conteudo" VARCHAR(2500) NOT NULL;
