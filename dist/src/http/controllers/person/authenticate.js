"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const invalid_credentials_1 = require("@/errors/invalid-credentials");
const make_authenticate_person_use_case_1 = require("@/factories/person/make-authenticate-person-use-case");
const zod_1 = require("zod");
const authenticate = async (app) => {
    app.post('/persons/authenticate', {
        schema: {
            tags: ['Users', 'Professional'],
            body: zod_1.z.object({
                email: zod_1.z.email(),
                password: zod_1.z.string().min(6),
            }),
            response: {
                200: zod_1.z.object({
                    user: zod_1.z.object({
                        userId: zod_1.z.uuid(),
                        isAuthenticated: zod_1.z.boolean(),
                    }),
                }),
                401: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                500: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { email, password } = request.body;
        const authenticatePersonUseCase = (0, make_authenticate_person_use_case_1.makeAuthenticatePersonUseCase)();
        try {
            const { user } = await authenticatePersonUseCase.execute({
                email,
                password,
            });
            return reply.status(200).send({ user });
        }
        catch (error) {
            if (error instanceof invalid_credentials_1.InvalidCredentialsError) {
                return reply.status(401).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.authenticate = authenticate;
