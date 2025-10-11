"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserByIdUseCase = makeGetUserByIdUseCase;
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const prisma_user_repository_1 = require("@/repositories/prisma/prisma-user-repository");
const get_user_by_id_1 = require("@/use-cases/person/user/get-user-by-id");
function makeGetUserByIdUseCase() {
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const prismaUserRepository = new prisma_user_repository_1.PrismaUserRepository();
    const getUserByIdUseCase = new get_user_by_id_1.GetUserByIdUseCase(prismaPersonRepository, prismaUserRepository);
    return getUserByIdUseCase;
}
