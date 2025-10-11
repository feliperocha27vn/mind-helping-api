"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const prisma_1 = require("@/lib/prisma");
const create_user_1 = require("@/utils/tests/create-user");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.afterEach)(async () => {
    await prisma_1.prisma.feelingsUser.deleteMany();
    await prisma_1.prisma.user.deleteMany();
    await prisma_1.prisma.person.deleteMany();
});
(0, vitest_1.describe)('Get feelings by date user', () => {
    (0, vitest_1.it)('should be able to get the user feelings by date', async () => {
        const { user } = await (0, create_user_1.createUser)();
        await prisma_1.prisma.feelingsUser.createMany({
            data: [
                {
                    description: 'FELIZ',
                    motive: 'Hoje é um ótimo dia!',
                    userPersonId: user.person_id,
                    createdAt: new Date('2023-07-20T14:00:00Z'),
                    updatedAt: new Date('2023-07-20T14:00:00Z'),
                },
                {
                    description: 'ANSIOSO',
                    motive: 'Hoje estou me sentindo ansioso!',
                    userPersonId: user.person_id,
                    createdAt: new Date('2023-07-20T16:00:00Z'),
                    updatedAt: new Date('2023-07-20T16:00:00Z'),
                },
                {
                    description: 'RAIVA',
                    motive: 'Hoje estou me sentindo raivoso!',
                    userPersonId: user.person_id,
                    updatedAt: new Date('2023-07-20T19:00:00Z'),
                    createdAt: new Date('2023-07-20T19:00:00Z'),
                },
            ],
        });
        const reply = await (0, supertest_1.default)(app_1.app.server).get(`/feelings/${user.person_id}?startDay=2023-07-20&endDay=2023-07-20`);
        (0, vitest_1.expect)(reply.status).toBe(200);
        (0, vitest_1.expect)(reply.body.feelings).toHaveLength(3);
        (0, vitest_1.expect)(reply.body.feelings[0].description).toBe('FELIZ');
        (0, vitest_1.expect)(reply.body.feelings[1].description).toBe('ANSIOSO');
        (0, vitest_1.expect)(reply.body.feelings[2].description).toBe('RAIVA');
    });
    (0, vitest_1.it)('should be able to get the user feelings by date range', async () => {
        const { user } = await (0, create_user_1.createUser)();
        await prisma_1.prisma.feelingsUser.createMany({
            data: [
                {
                    description: 'FELIZ',
                    motive: 'Primeiro dia!',
                    userPersonId: user.person_id,
                    createdAt: new Date('2023-07-20T14:00:00Z'),
                    updatedAt: new Date('2023-07-20T14:00:00Z'),
                },
                {
                    description: 'ANSIOSO',
                    motive: 'Segundo dia!',
                    userPersonId: user.person_id,
                    createdAt: new Date('2023-07-21T16:00:00Z'),
                    updatedAt: new Date('2023-07-21T16:00:00Z'),
                },
                {
                    description: 'RAIVA',
                    motive: 'Terceiro dia!',
                    userPersonId: user.person_id,
                    createdAt: new Date('2023-07-22T19:00:00Z'),
                    updatedAt: new Date('2023-07-22T19:00:00Z'),
                },
                {
                    description: 'TEDIO',
                    motive: 'Fora do intervalo!',
                    userPersonId: user.person_id,
                    createdAt: new Date('2023-07-25T19:00:00Z'),
                    updatedAt: new Date('2023-07-25T19:00:00Z'),
                },
            ],
        });
        const reply = await (0, supertest_1.default)(app_1.app.server).get(`/feelings/${user.person_id}?startDay=2023-07-20&endDay=2023-07-22`);
        (0, vitest_1.expect)(reply.status).toBe(200);
        (0, vitest_1.expect)(reply.body.feelings).toHaveLength(3);
        (0, vitest_1.expect)(reply.body.feelings[0].description).toBe('FELIZ');
        (0, vitest_1.expect)(reply.body.feelings[1].description).toBe('ANSIOSO');
        (0, vitest_1.expect)(reply.body.feelings[2].description).toBe('RAIVA');
    });
});
