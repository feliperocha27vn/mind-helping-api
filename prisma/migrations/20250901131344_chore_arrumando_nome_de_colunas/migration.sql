/*
  Warnings:

  - You are about to drop the column `createdAt` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `isExecuted` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `isExpire` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `numberDays` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `goal` table. All the data in the column will be lost.
  - Added the required column `number_days` to the `goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goal" DROP COLUMN "createdAt",
DROP COLUMN "isExecuted",
DROP COLUMN "isExpire",
DROP COLUMN "numberDays",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_executed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_expire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "number_days" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
