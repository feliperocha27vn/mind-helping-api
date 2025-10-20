-- CreateTable
CREATE TABLE "cvv_calls" (
    "id" TEXT NOT NULL,
    "date_called" TIMESTAMP(3) NOT NULL,
    "time_called" TEXT NOT NULL,
    "user_person_id" TEXT NOT NULL,

    CONSTRAINT "cvv_calls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cvv_calls" ADD CONSTRAINT "cvv_calls_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
