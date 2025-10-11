"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const prisma_1 = require("@/lib/prisma");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.describe)('Delete goal', () => {
    (0, vitest_1.it)('should be able to delete a goal', async () => {
        // Primeiro criar a Person
        const person = await prisma_1.prisma.person.create({
            data: {
                name: 'Ana Clara Oliveira',
                address: 'Avenida Brasil',
                neighborhood: 'Centro',
                number: 1500,
                complement: 'Sala 32',
                cep: '16200001',
                city: 'Birigui',
                uf: 'SP',
                phone: '(18) 99123-4567',
                email: 'ana.oliveira@example.com',
                password_hash: 'umaSenhaForte!@#',
                birth_date: new Date('1992-08-25'),
                cpf: '123.456.789-00',
            },
        });
        // Depois criar o User vinculado à Person
        const user = await prisma_1.prisma.user.create({
            data: {
                person_id: person.id,
                gender: 'F',
            },
        });
        const goal = await prisma_1.prisma.goal.create({
            data: {
                userPersonId: user.person_id, // Usar o person_id do User
                description: 'New Goal',
                numberDays: 5,
            },
        });
        const reply = await (0, supertest_1.default)(app_1.app.server).delete(`/goal/${goal.id}/${user.person_id}`);
        (0, vitest_1.expect)(reply.statusCode).toEqual(204);
    });
    (0, vitest_1.it)('should not be able to delete a non-existing goal', async () => {
        const reply = await (0, supertest_1.default)(app_1.app.server).delete(`/goal/c8654792-f288-4f14-a15c-74b2abb6bf2e/86ca1c65-544f-4200-be12-9df5125f607b`);
        (0, vitest_1.expect)(reply.statusCode).toEqual(404);
    });
});
