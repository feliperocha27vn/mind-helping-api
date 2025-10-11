"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const prisma_1 = require("@/lib/prisma");
const create_goal_1 = require("@/utils/tests/create-goal");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.describe)('Execute goal', () => {
    (0, vitest_1.it)('should be able to execute a goal', async () => {
        const { goal, user } = await (0, create_goal_1.createGoalWithPrisma)();
        const reply = await (0, supertest_1.default)(app_1.app.server).patch(`/goal/execute/${goal.id}/${user.person_id}`);
        (0, vitest_1.expect)(reply.statusCode).toEqual(200);
        const isUpdatedGoal = await prisma_1.prisma.goal.findUniqueOrThrow({
            where: { id: goal.id },
        });
        (0, vitest_1.expect)(isUpdatedGoal.isExecuted).toBe(true);
    });
});
