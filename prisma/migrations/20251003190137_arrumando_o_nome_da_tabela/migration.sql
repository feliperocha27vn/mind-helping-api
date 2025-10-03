/*
  Warnings:

  - You are about to drop the `feelings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."feelings";

-- CreateTable
CREATE TABLE "feelings_user" (
    "id" TEXT NOT NULL,
    "description" "FeelingsType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feelings_user_pkey" PRIMARY KEY ("id")
);
