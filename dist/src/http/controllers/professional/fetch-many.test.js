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
(0, vitest_1.describe)('Fetch Many Professionals', () => {
    (0, vitest_1.it)('should be able to fetch many professionals', async () => {
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
        await prisma_1.prisma.professional.create({
            data: {
                crp: '06/123456',
                voluntary: true,
                person_id: person.id,
            },
        });
        const reply = await (0, supertest_1.default)(app_1.app.server).get('/professionals').query({
            search: 'Ana',
        });
        (0, vitest_1.expect)(reply.statusCode).toEqual(200);
        (0, vitest_1.expect)(reply.body.professionals).toBeInstanceOf(Array);
    });
});
