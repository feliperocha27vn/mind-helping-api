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
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.describe)('Create new scheduling', () => {
    (0, vitest_1.it)('should be able to create new scheduling', async () => {
        const { professional, schedule } = await (0, create_professional_and_schedule_1.createProfessionalAndSchedule)();
        const { user } = await (0, create_user_1.createUser)();
        // Usa uma data futura (30 dias a partir de agora)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        // Define horários para o dia (09:00 às 18:00)
        const initialTime = new Date(futureDate);
        initialTime.setUTCHours(9, 0, 0, 0);
        const endTime = new Date(futureDate);
        endTime.setUTCHours(18, 0, 0, 0);
        // Formata a data no formato YYYY-MM-DD
        const year = futureDate.getUTCFullYear();
        const month = String(futureDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(futureDate.getUTCDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        await (0, create_hourlies_1.createHourlies)(schedule.id, initialTime, endTime, schedule.interval);
        const reply = await (0, supertest_1.default)(app_1.app.server).post('/schedulings').send({
            professionalPersonId: professional.person_id,
            userPersonId: user.person_id,
            scheduleId: schedule.id,
            date: dateString,
            hour: '10:00',
        });
        (0, vitest_1.expect)(reply.statusCode).toEqual(201);
        const schedulingCreated = await prisma_1.prisma.scheduling.findFirstOrThrow({
            where: {
                userPersonId: user.person_id,
            },
        });
        (0, vitest_1.expect)(schedulingCreated.professionalPersonId).toEqual(professional.person_id);
    });
});
