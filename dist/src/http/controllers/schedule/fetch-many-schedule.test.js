"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const create_professional_and_schedule_1 = require("@/utils/tests/create-professional-and-schedule");
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
(0, vitest_1.describe)('Fetch many schedules', () => {
    (0, vitest_1.it)('should be able to fetch many schedules', async () => {
        const { professional } = await (0, create_professional_and_schedule_1.createProfessionalAndSchedule)();
        const reply = await (0, supertest_1.default)(app_1.app.server).get(`/schedules/${professional.person_id}`);
        (0, vitest_1.expect)(reply.statusCode).toEqual(200);
        (0, vitest_1.expect)(reply.body.schedules).toHaveLength(1);
    });
});
