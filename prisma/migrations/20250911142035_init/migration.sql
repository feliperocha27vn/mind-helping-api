-- CreateTable
CREATE TABLE "public"."person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."professionals" (
    "person_id" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "voluntary" BOOLEAN NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "person_id" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "public"."goal" (
    "id" TEXT NOT NULL,
    "user_person_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "number_days" INTEGER NOT NULL,
    "is_executed" BOOLEAN NOT NULL DEFAULT false,
    "is_expire" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_person_id" TEXT NOT NULL,

    CONSTRAINT "daily_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "public"."person"("email");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."goal" ADD CONSTRAINT "goal_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "public"."user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily" ADD CONSTRAINT "daily_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "public"."user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedule" ADD CONSTRAINT "schedule_professional_person_id_fkey" FOREIGN KEY ("professional_person_id") REFERENCES "public"."professionals"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling" ADD CONSTRAINT "scheduling_hourly_id_fkey" FOREIGN KEY ("hourly_id") REFERENCES "public"."hourly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling" ADD CONSTRAINT "scheduling_professional_person_id_fkey" FOREIGN KEY ("professional_person_id") REFERENCES "public"."professionals"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling" ADD CONSTRAINT "scheduling_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "public"."user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hourly" ADD CONSTRAINT "hourly_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
