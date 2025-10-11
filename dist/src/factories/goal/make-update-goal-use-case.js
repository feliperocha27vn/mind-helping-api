"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdateGoalUseCase = makeUpdateGoalUseCase;
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const update_1 = require("@/use-cases/goal/update");
function makeUpdateGoalUseCase() {
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const updateGoalUseCase = new update_1.UpdateGoalUseCase(prismaGoalRepository, prismaPersonRepository);
    return updateGoalUseCase;
}
