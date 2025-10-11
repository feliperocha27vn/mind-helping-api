"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFetchManyGoalsUseCase = makeFetchManyGoalsUseCase;
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const fetch_many_1 = require("@/use-cases/goal/fetch-many");
function makeFetchManyGoalsUseCase() {
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const fetchManyGoalsUseCase = new fetch_many_1.FetchManyGoalsUseCase(prismaGoalRepository, prismaPersonRepository);
    return fetchManyGoalsUseCase;
}
