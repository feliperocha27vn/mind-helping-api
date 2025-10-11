"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddCounterGoalUseCase = makeAddCounterGoalUseCase;
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const add_counter_1 = require("@/use-cases/goal/add-counter");
function makeAddCounterGoalUseCase() {
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const addCounterGoalUseCase = new add_counter_1.AddCounterUseCase(prismaGoalRepository, prismaPersonRepository);
    return addCounterGoalUseCase;
}
