-- CreateTable
CREATE TABLE "daily" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_person_id" TEXT NOT NULL,

    CONSTRAINT "daily_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "daily" ADD CONSTRAINT "daily_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
