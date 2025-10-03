-- CreateEnum
CREATE TYPE "FeelingsType" AS ENUM ('TRISTE', 'ANSIOSO', 'TEDIO', 'RAIVA', 'NÃO_SEI_DIZER', 'FELIZ');

-- CreateTable
CREATE TABLE "feelings" (
    "id" TEXT NOT NULL,
    "description" "FeelingsType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feelings_pkey" PRIMARY KEY ("id")
);
