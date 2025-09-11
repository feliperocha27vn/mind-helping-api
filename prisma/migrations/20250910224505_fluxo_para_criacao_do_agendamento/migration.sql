-- CreateTable
CREATE TABLE "public"."scheduling" (
    "id" TEXT NOT NULL,
    "hourly_id" TEXT NOT NULL,
    "professional_person_id" TEXT NOT NULL,
    "user_person_id" TEXT NOT NULL,

    CONSTRAINT "scheduling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hourly" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hour" TEXT NOT NULL,
    "is_ocuped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "hourly_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."scheduling" ADD CONSTRAINT "scheduling_hourly_id_fkey" FOREIGN KEY ("hourly_id") REFERENCES "public"."hourly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling" ADD CONSTRAINT "scheduling_professional_person_id_fkey" FOREIGN KEY ("professional_person_id") REFERENCES "public"."professionals"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling" ADD CONSTRAINT "scheduling_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "public"."user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hourly" ADD CONSTRAINT "hourly_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
