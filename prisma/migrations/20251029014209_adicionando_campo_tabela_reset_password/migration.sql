/*
  Warnings:

  - Added the required column `expires_at` to the `reset_password_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reset_password_codes" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
