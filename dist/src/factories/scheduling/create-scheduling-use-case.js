"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateSchedulingUseCase = makeCreateSchedulingUseCase;
const prisma_hourly_repository_1 = require("@/repositories/prisma/prisma-hourly-repository");
const prisma_professional_repository_1 = require("@/repositories/prisma/prisma-professional-repository");
const prisma_schedule_repository_1 = require("@/repositories/prisma/prisma-schedule-repository");
const prisma_scheduling_repository_1 = require("@/repositories/prisma/prisma-scheduling-repository");
const prisma_user_repository_1 = require("@/repositories/prisma/prisma-user-repository");
const create_1 = require("@/use-cases/scheduling/create");
function makeCreateSchedulingUseCase() {
    const primsaScheduleRepository = new prisma_schedule_repository_1.PrismaScheduleRepository();
    const prismaSchedulingRepository = new prisma_scheduling_repository_1.PrismaSchedulingRepository();
    const prismaHourlyRepository = new prisma_hourly_repository_1.PrismaHourlyRepository();
    const prismaProfessionalRepository = new prisma_professional_repository_1.PrismaProfessionalRepository();
    const prismaUserRepository = new prisma_user_repository_1.PrismaUserRepository();
    const createSchedulingUseCase = new create_1.CreateSchedulingUseCase(primsaScheduleRepository, prismaSchedulingRepository, prismaHourlyRepository, prismaProfessionalRepository, prismaUserRepository);
    return createSchedulingUseCase;
}
