"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateGoalUseCase = makeCreateGoalUseCase;
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const create_1 = require("@/use-cases/goal/create");
function makeCreateGoalUseCase() {
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const createGoalUseCase = new create_1.CreateGoalUseCase(prismaGoalRepository, prismaPersonRepository);
    return createGoalUseCase;
}
