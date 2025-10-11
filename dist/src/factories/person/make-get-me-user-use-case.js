"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetMeUserUseCase = makeGetMeUserUseCase;
const prisma_feelings_repository_1 = require("@/repositories/prisma/prisma-feelings-repository");
const prisma_goal_repository_1 = require("@/repositories/prisma/prisma-goal-repository");
const prisma_person_repository_1 = require("@/repositories/prisma/prisma-person-repository");
const get_me_user_1 = require("@/use-cases/person/user/get-me-user");
function makeGetMeUserUseCase() {
    const prismaPersonRepository = new prisma_person_repository_1.PrismaPersonRepository();
    const prismaFeelingsRepository = new prisma_feelings_repository_1.PrismaFeelingsRepository();
    const prismaGoalRepository = new prisma_goal_repository_1.PrismaGoalRepository();
    const getMeUserUseCase = new get_me_user_1.GetMeUserUseCase(prismaPersonRepository, prismaFeelingsRepository, prismaGoalRepository);
    return getMeUserUseCase;
}
