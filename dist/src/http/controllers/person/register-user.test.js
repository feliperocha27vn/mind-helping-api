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
    (0, vitest_1.it)('should be able to register a user', async () => {
        const reply = await (0, supertest_1.default)(app_1.app.server).post('/user').send({
            name: 'Ana Carolina Santos',
            birth_date: '1995-08-23',
            cpf: '12345678900',
            address: 'Rua das Acácias',
            neighborhood: 'Centro',
            number: 456,
            complement: 'Apto 12',
            cepUser: '16200001',
            city: 'Birigui',
            uf: 'SP',
            phone: '18991234567',
            email: 'ana.teste.e2e@example.com',
            password: 'SenhaForte@2025',
            gender: 'Feminino',
        });
        (0, vitest_1.expect)(reply.statusCode).toEqual(201);
    });
});
