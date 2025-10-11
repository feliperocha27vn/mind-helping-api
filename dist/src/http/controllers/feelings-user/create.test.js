"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const create_user_1 = require("@/utils/tests/create-user");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await app_1.app.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.app.close();
});
(0, vitest_1.describe)('Create feeling user', () => {
    (0, vitest_1.it)('should be able to create a new feeling for the user', async () => {
        const { user } = await (0, create_user_1.createUser)();
        const reply = await (0, supertest_1.default)(app_1.app.server)
            .post(`/feelings/${user.person_id}`)
            .send({
            description: 'FELIZ',
            motive: 'Hoje é um ótimo dia!',
        });
        (0, vitest_1.expect)(reply.statusCode).toEqual(201);
    });
});
