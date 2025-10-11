"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const prisma_1 = require("@/lib/prisma");
const create_professional_1 = require("@/utils/tests/create-professional");
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
(0, vitest_1.describe)('Create new schedule', () => {
    (0, vitest_1.it)('should be able to create new schedule', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-11-20T09:00:00'));
        const { professional } = await (0, create_professional_1.createProfessional)();
        const reply = await (0, supertest_1.default)(app_1.app.server)
            .post(`/schedules/${professional.person_id}`)
            .send([
            {
                initialTime: new Date('2024-12-01T09:00:00.000Z'),
                endTime: new Date('2024-12-01T17:00:00.000Z'),
                interval: 60,
                cancellationPolicy: 24,
                averageValue: 150,
                observation: 'Available for new clients',
                isControlled: true,
            },
            {
                initialTime: new Date('2024-12-02T09:00:00.000Z'),
                endTime: new Date('2024-12-02T16:00:00.000Z'),
                interval: 60,
                cancellationPolicy: 24,
                averageValue: 150,
                observation: 'Available for new clients',
                isControlled: true,
            },
        ]);
        const createdSchedules = await prisma_1.prisma.schedule.findMany({
            where: { professionalPersonId: professional.person_id },
            orderBy: { initialTime: 'asc' },
        });
        const createdHourliesFirst = await prisma_1.prisma.hourly.findMany({
            where: { scheduleId: createdSchedules[0].id },
            orderBy: { date: 'asc' },
        });
        const createdHourliesSecond = await prisma_1.prisma.hourly.findMany({
            where: { scheduleId: createdSchedules[1].id },
            orderBy: { date: 'asc' },
        });
        (0, vitest_1.expect)(reply.statusCode).toEqual(201);
        (0, vitest_1.expect)(createdSchedules).toHaveLength(2); // Deve criar 2 schedules
        (0, vitest_1.expect)(createdHourliesFirst).toHaveLength(8); // 09:00 até 16:00 com intervalo de 60min = 8 slots (09,10,11,12,13,14,15,16)
        (0, vitest_1.expect)(createdHourliesSecond).toHaveLength(7); // 09:00 até 16:00 com intervalo de 60min = 7 slots (09,10,11,12,13,14,15)
    });
});
