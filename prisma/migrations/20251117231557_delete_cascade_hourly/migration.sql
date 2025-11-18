-- DropForeignKey
ALTER TABLE "public"."hourly" DROP CONSTRAINT "hourly_schedule_id_fkey";

-- AddForeignKey
ALTER TABLE "hourly" ADD CONSTRAINT "hourly_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
