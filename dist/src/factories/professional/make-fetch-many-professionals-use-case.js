"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFetchManyProfessionalsUseCase = makeFetchManyProfessionalsUseCase;
const prisma_professional_repository_1 = require("@/repositories/prisma/prisma-professional-repository");
const fetch_many_1 = require("@/use-cases/professional/fetch-many");
function makeFetchManyProfessionalsUseCase() {
    const prismaProfessionalRepository = new prisma_professional_repository_1.PrismaProfessionalRepository();
    const fetchManyProfessionalsUseCase = new fetch_many_1.FetchManyProfessionalsUseCase(prismaProfessionalRepository);
    return fetchManyProfessionalsUseCase;
}
