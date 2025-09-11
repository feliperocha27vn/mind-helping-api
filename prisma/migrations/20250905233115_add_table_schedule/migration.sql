-- CreateTable
CREATE TABLE "public"."schedule" (
    "id" TEXT NOT NULL,
    "professional_person_id" TEXT NOT NULL,
    "initial_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "interval" INTEGER NOT NULL,
    "cancellation_policy" INTEGER NOT NULL,
    "average_value" DECIMAL(65,30) NOT NULL,
    "observation" TEXT,
    "isControlled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."schedule" ADD CONSTRAINT "schedule_professional_person_id_fkey" FOREIGN KEY ("professional_person_id") REFERENCES "public"."professionals"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
