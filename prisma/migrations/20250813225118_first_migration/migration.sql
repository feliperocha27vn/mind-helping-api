-- CreateTable
CREATE TABLE "person" (
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
CREATE TABLE "professionals" (
    "person_id" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "voluntary" BOOLEAN NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "user" (
    "person_id" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "goal" (
    "id" TEXT NOT NULL,
    "user_person_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "numberDays" INTEGER NOT NULL,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,
    "isExpire" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal" ADD CONSTRAINT "goal_user_person_id_fkey" FOREIGN KEY ("user_person_id") REFERENCES "user"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
