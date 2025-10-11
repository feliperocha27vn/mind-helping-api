"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetSchedulingUseCase = makeGetSchedulingUseCase;
const prisma_hourly_repository_1 = require("@/repositories/prisma/prisma-hourly-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const prisma_scheduling_repository_1 = require("@/repositories/prisma/prisma-scheduling-repository");
const get_by_user_id_1 = require("@/use-cases/scheduling/get-by-user-id");
function makeGetSchedulingUseCase() {
    const prismaSchedulingRepository = new prisma_scheduling_repository_1.PrismaSchedulingRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const prismaHourlyRepository = new prisma_hourly_repository_1.PrismaHourlyRepository();
    const getSchedulingUseCase = new get_by_user_id_1.GetSchedulingUseCase(prismaSchedulingRepository, prismaPersonRepository, prismaHourlyRepository);
    return getSchedulingUseCase;
}
