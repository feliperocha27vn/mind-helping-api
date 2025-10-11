"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const email_already_exists_error_1 = require("@/errors/email-already-exists-error");
const make_register_person_use_case_1 = require("@/factories/person/make-register-person-use-case");
const make_register_user_use_case_1 = require("@/factories/person/make-register-user-use-case");
const v4_1 = require("zod/v4");
const registerUser = async (app) => {
    app.post('/users', {
        schema: {
            tags: ['Users'],
            body: v4_1.z.object({
                name: v4_1.z.string(),
                birth_date: v4_1.z.coerce.date(),
                cpf: v4_1.z.string(),
                address: v4_1.z.string(),
                neighborhood: v4_1.z.string(),
                number: v4_1.z.number(),
                complement: v4_1.z.string(),
                cepUser: v4_1.z.string(),
                city: v4_1.z.string(),
                uf: v4_1.z.string(),
                phone: v4_1.z.string(),
                email: v4_1.z.email(),
                password: v4_1.z.string(),
                gender: v4_1.z.string().optional(),
            }),
            response: {
                201: v4_1.z.object({
                    user: v4_1.z.object({
                        person_id: v4_1.z.string(),
                        gender: v4_1.z.string(),
                    }),
                }),
                400: v4_1.z.object({ message: v4_1.z.string() }),
                500: v4_1.z.object({ message: v4_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        const { name, birth_date, cpf, address, neighborhood, number, complement, cepUser, city, uf, phone, email, password, gender, } = request.body;
        try {
            const personUseCase = (0, make_register_person_use_case_1.makePersonUseCase)();
            const { person } = await personUseCase.execute({
                name,
                birth_date,
                cpf,
                address,
                neighborhood,
                number,
                complement,
                cepUser,
                city,
                uf,
                phone,
                email,
                password,
            });
            const userUseCase = (0, make_register_user_use_case_1.makeRegisterUserUseCase)();
            const { user } = await userUseCase.execute({
                person_id: person.id,
                gender,
            });
            reply.status(201).send({ user });
        }
        catch (error) {
            if (error instanceof email_already_exists_error_1.EmailAlreadyExistsError) {
                return reply.status(400).send({ message: error.message });
            }
            if (error instanceof Error) {
                return reply.status(500).send({ message: error.message });
            }
            return reply
                .status(500)
                .send({ message: 'An unexpected error occurred' });
        }
    });
};
exports.registerUser = registerUser;
