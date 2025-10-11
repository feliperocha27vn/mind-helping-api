"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateScheduleUseCase = makeCreateScheduleUseCase;
const prisma_hourly_repository_1 = require("@/repositories/prisma/prisma-hourly-repository");
const prisma_professional_repository_1 = require("@/repositories/prisma/prisma-professional-repository");
const prisma_schedule_repository_1 = require("@/repositories/prisma/prisma-schedule-repository");
const create_1 = require("@/use-cases/schedule/create");
function makeCreateScheduleUseCase() {
    const prismaScheduleRepository = new prisma_schedule_repository_1.PrismaScheduleRepository();
    const prismaHourlyRepository = new prisma_hourly_repository_1.PrismaHourlyRepository();
    const prismaProfessionalRepository = new prisma_professional_repository_1.PrismaProfessionalRepository();
    const createScheduleUseCase = new create_1.CreateScheduleUseCase(prismaScheduleRepository, prismaHourlyRepository, prismaProfessionalRepository);
    return createScheduleUseCase;
}
