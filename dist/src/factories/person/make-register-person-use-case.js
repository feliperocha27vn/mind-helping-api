"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePersonUseCase = makePersonUseCase;
const prisma_person_repository_1 = require("../../repositories/prisma/prisma-person-repository");
const register_1 = require("../../use-cases/person/register");
function makePersonUseCase() {
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const registerUseCase = new register_1.RegisterUseCase(prismaPersonRepository);
    return registerUseCase;
}
