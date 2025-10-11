"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFetchManyScheduleUseCase = makeFetchManyScheduleUseCase;
const prisma_professional_repository_1 = require("@/repositories/prisma/prisma-professional-repository");
const prisma_schedule_repository_1 = require("@/repositories/prisma/prisma-schedule-repository");
const fetch_many_1 = require("@/use-cases/schedule/fetch-many");
function makeFetchManyScheduleUseCase() {
    const prismaProfessionalRepository = new prisma_professional_repository_1.PrismaProfessionalRepository();
    const prismaScheduleRepository = new prisma_schedule_repository_1.PrismaScheduleRepository();
    const fetchManySchedulesUseCase = new fetch_many_1.FetchManySchedulesUseCase(prismaScheduleRepository, prismaProfessionalRepository);
    return fetchManySchedulesUseCase;
}
