"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const create_hourlies_1 = require("@/utils/tests/create-hourlies");
const create_professional_and_schedule_1 = require("@/utils/tests/create-professional-and-schedule");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.describe)('Fetch hourlies by schedule ID', () => {
    (0, vitest_1.it)('should be able to fetch hourlies by schedule ID', async () => {
        const { schedule } = await (0, create_professional_and_schedule_1.createProfessionalAndSchedule)();
        await (0, create_hourlies_1.createHourlies)(schedule.id, schedule.initialTime || new Date(), schedule.endTime || new Date(), schedule.interval || 60);
        const reply = await (0, supertest_1.default)(app_1.app.server)
            .get(`/hourlies/${schedule.id}`)
            .send();
        (0, vitest_1.expect)(reply.statusCode).toEqual(200);
    });
});
