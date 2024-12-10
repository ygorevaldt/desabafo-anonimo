/*
  Warnings:

  - Added the required column `session_id` to the `apoio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apoio" ADD COLUMN     "session_id" UUID DEFAULT NULL;
