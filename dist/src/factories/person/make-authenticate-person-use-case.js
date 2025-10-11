"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthenticatePersonUseCase = makeAuthenticatePersonUseCase;
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const authenticate_1 = require("@/use-cases/person/authenticate");
function makeAuthenticatePersonUseCase() {
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const authenticatePersonUseCase = new authenticate_1.AuthenticatePersonUseCase(prismaPersonRepository);
    return authenticatePersonUseCase;
}
