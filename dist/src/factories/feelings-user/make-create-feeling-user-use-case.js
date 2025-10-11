"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateFeelingUserUseCase = makeCreateFeelingUserUseCase;
const prisma_feelings_repository_1 = require("@/repositories/prisma/prisma-feelings-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const create_1 = require("@/use-cases/feelings-user/create");
function makeCreateFeelingUserUseCase() {
    const prismaFeelingsRepository = new prisma_feelings_repository_1.PrismaFeelingsRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const createFeelingUserUseCase = new create_1.CreateFeelingUserUseCase(prismaFeelingsRepository, prismaPersonRepository);
    return createFeelingUserUseCase;
}
