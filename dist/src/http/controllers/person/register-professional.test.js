"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.describe)('Register Professional Controller', () => {
    (0, vitest_1.it)('should be able to register a professional', async () => {
        const reply = await (0, supertest_1.default)(app_1.app.server).post('/professional').send({
            name: 'Ana Clara Oliveira',
            birth_date: '1992-08-25',
            cpf: '123.456.789-00',
            address: 'Avenida Brasil',
            neighborhood: 'Centro',
            number: 1500,
            complement: 'Sala 32',
            cepUser: '16200-001',
            city: 'Birigui',
            uf: 'SP',
            phone: '(18) 99123-4567',
            email: 'ana.oliveira@example.com',
            password: 'umaSenhaForte!@#',
            crp: '06/123456',
            voluntary: true,
        });
        (0, vitest_1.expect)(reply.statusCode).toEqual(201);
    });
});
