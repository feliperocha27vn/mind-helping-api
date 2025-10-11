"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetFeelingsByDateUseCase = makeGetFeelingsByDateUseCase;
const prisma_feelings_repository_1 = require("@/repositories/prisma/prisma-feelings-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const prisma_user_repository_1 = require("@/repositories/prisma/prisma-user-repository");
const get_feelings_by_date_1 = require("@/use-cases/feelings-user/get-feelings-by-date");
function makeGetFeelingsByDateUseCase() {
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const prismaUserRepository = new prisma_user_repository_1.PrismaUserRepository();
    const prismaFeelingsRepository = new prisma_feelings_repository_1.PrismaFeelingsRepository();
    const getFeelingsByDateUseCase = new get_feelings_by_date_1.GetFeelingsByDateUseCase(prismaPersonRepository, prismaUserRepository, prismaFeelingsRepository);
    return getFeelingsByDateUseCase;
}
