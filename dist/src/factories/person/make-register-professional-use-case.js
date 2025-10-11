"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRegisterProfessionalUseCase = makeRegisterProfessionalUseCase;
const prisma_person_repository_1 = require("../../repositories/prisma/prisma-person-repository");
const prisma_professional_repository_1 = require("../../repositories/prisma/prisma-professional-repository");
const register_professional_1 = require("../../use-cases/person/professional/register-professional");
function makeRegisterProfessionalUseCase() {
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const prismaProfessionalRepository = new prisma_professional_repository_1.PrismaProfessionalRepository();
    const registerProfessionalUseCase = new register_professional_1.RegisterProfessionalUseCase(prismaProfessionalRepository, prismaPersonRepository);
    return registerProfessionalUseCase;
}
