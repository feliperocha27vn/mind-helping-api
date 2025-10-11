"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteGoalUseCase = makeDeleteGoalUseCase;
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const delete_1 = require("@/use-cases/goal/delete");
function makeDeleteGoalUseCase() {
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const personRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const deleteGoalUseCase = new delete_1.DeleteGoalUseCase(prismaGoalRepository, personRepository);
    return deleteGoalUseCase;
}
