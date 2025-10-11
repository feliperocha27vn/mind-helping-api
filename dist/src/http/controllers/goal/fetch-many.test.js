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
(0, vitest_1.describe)('Fetch goals', () => {
    (0, vitest_1.it)('should be able to fetch goals for a user', async () => {
        const { user } = await (0, create_goal_1.createGoalWithPrisma)();
        await prisma_1.prisma.goal.createMany({
            data: [
                {
                    userPersonId: user.person_id,
                    description: 'New Goal',
                    numberDays: 5,
                },
                {
                    userPersonId: user.person_id,
                    description: 'New Goal 2',
                    numberDays: 10,
                },
            ],
        });
        const reply = await (0, supertest_1.default)(app_1.app.server).get(`/goals/${user.person_id}`);
        (0, vitest_1.expect)(reply.statusCode).toEqual(200);
        const goals = await prisma_1.prisma.goal.findMany({
            where: { userPersonId: user.person_id },
        });
        (0, vitest_1.expect)(goals.length).toEqual(3);
    });
});
