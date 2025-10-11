"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const prisma_1 = require("@/lib/prisma");
const create_hourlies_1 = require("@/utils/tests/create-hourlies");
const create_professional_and_schedule_1 = require("@/utils/tests/create-professional-and-schedule");
const create_user_1 = require("@/utils/tests/create-user");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
    vitest_1.vi.useFakeTimers();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
    vitest_1.vi.useRealTimers();
});
(0, vitest_1.describe)('Get scheduling by user ID', () => {
    (0, vitest_1.it)('should be able to get scheduling by user ID', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-12-31T09:00:00'));
        const { professional, schedule } = await (0, create_professional_and_schedule_1.createProfessionalAndSchedule)();
        const { user } = await (0, create_user_1.createUser)();
        const { hourlies } = await (0, create_hourlies_1.createHourlies)(schedule.id, schedule.initialTime || new Date('2024-12-31T09:00:00.000Z'), schedule.endTime || new Date('2024-12-31T18:00:00.000Z'), schedule.interval);
        await prisma_1.prisma.scheduling.create({
            data: {
                professionalPersonId: professional.person_id,
                userPersonId: user.person_id,
                hourlyId: hourlies[0].id,
            },
        });
        const reply = await (0, supertest_1.default)(app_1.app.server).get(`/schedulings/${user.person_id}`);
        (0, vitest_1.expect)(reply.status).toBe(200);
        (0, vitest_1.expect)(reply.body.schedulingDetails).toEqual(vitest_1.expect.objectContaining({
            id: vitest_1.expect.any(String),
        }));
    });
});
