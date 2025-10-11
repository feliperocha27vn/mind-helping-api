"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFetchManyByScheduleIdUseCase = makeFetchManyByScheduleIdUseCase;
const prisma_hourly_repository_1 = require("@/repositories/prisma/prisma-hourly-repository");
const prisma_schedule_repository_1 = require("@/repositories/prisma/prisma-schedule-repository");
const fetch_many_by_schedule_id_1 = require("@/use-cases/hourlies/fetch-many-by-schedule-id");
function makeFetchManyByScheduleIdUseCase() {
    const prismaHourlyRepository = new prisma_hourly_repository_1.PrismaHourlyRepository();
    const prismaScheduleRepository = new prisma_schedule_repository_1.PrismaScheduleRepository();
    const fetchManyHourliesByScheduleIdUseCase = new fetch_many_by_schedule_id_1.FetchManyHourliesByScheduleIdUseCase(prismaHourlyRepository, prismaScheduleRepository);
    return fetchManyHourliesByScheduleIdUseCase;
}
