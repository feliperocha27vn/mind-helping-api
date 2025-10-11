"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExecuteGoalUseCase = makeExecuteGoalUseCase;
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const execute_goal_use_case_1 = require("@/use-cases/goal/execute-goal-use-case");
function makeExecuteGoalUseCase() {
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const executeGoalUseCase = new execute_goal_use_case_1.ExecuteGoalUseCase(prismaGoalRepository, prismaPersonRepository);
    return executeGoalUseCase;
}
