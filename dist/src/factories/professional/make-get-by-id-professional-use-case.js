"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetByIdProfessionalUseCase = makeGetByIdProfessionalUseCase;
const prisma_professional_repository_1 = require("@/repositories/prisma/prisma-professional-repository");
const get_professional_1 = require("@/use-cases/professional/get-professional");
function makeGetByIdProfessionalUseCase() {
    const prismaProfessionalRepository = new prisma_professional_repository_1.PrismaProfessionalRepository();
    const getByIdProfessionalUseCase = new get_professional_1.GetProfessionalByIdUseCase(prismaProfessionalRepository);
    return getByIdProfessionalUseCase;
}
