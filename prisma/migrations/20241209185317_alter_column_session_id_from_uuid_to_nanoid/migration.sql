/*
  Warnings:

  - Changed the type of `session_id` on the `apoio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "apoio" DROP COLUMN "session_id",
ADD COLUMN     "session_id" VARCHAR(21) NOT NULL;
