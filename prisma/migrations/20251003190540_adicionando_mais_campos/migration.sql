/*
  Warnings:

  - Added the required column `user_person_id` to the `feelings_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feelings_user" ADD COLUMN     "motive" TEXT,
ADD COLUMN     "user_person_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "feelings_user" ADD CONSTRAINT "feelings_user_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
