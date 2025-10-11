"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRegisterUserUseCase = makeRegisterUserUseCase;
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const prisma_user_repository_1 = require("@/repositories/prisma/prisma-user-repository");
const register_user_1 = require("@/use-cases/person/user/register-user");
function makeRegisterUserUseCase() {
    const prismaUserRepository = new prisma_user_repository_1.PrismaUserRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const userUseCase = new register_user_1.RegisterUserUseCase(prismaUserRepository, prismaPersonRepository);
    return userUseCase;
}
