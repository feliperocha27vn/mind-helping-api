"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_get_user_by_id_use_case_1 = require("@/factories/person/make-get-user-by-id-use-case");
const zod_1 = __importDefault(require("zod"));
const getUserById = async (app) => {
    app.get('/users/:userId', {
        schema: {
            tags: ['Users'],
            params: zod_1.default.object({
                userId: zod_1.default.uuid(),
            }),
            response: {
                200: zod_1.default.object({
                    user: zod_1.default.object({
                        name: zod_1.default.string(),
                        birthDate: zod_1.default.date(),
                        phone: zod_1.default.string(),
                        email: zod_1.default.email(),
                        cpf: zod_1.default.string(),
                        gender: zod_1.default.string(),
                        address: zod_1.default.object({
                            street: zod_1.default.string(),
                            neighborhood: zod_1.default.string(),
                            number: zod_1.default.number(),
                            cep: zod_1.default.string(),
                            city: zod_1.default.string(),
                        }),
                    }),
                }),
                404: zod_1.default.object({
                    message: zod_1.default.string(),
                }),
                500: zod_1.default.object({
                    message: zod_1.default.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { userId } = request.params;
        const getUserByIdUseCase = (0, make_get_user_by_id_use_case_1.makeGetUserByIdUseCase)();
        try {
            const { user } = await getUserByIdUseCase.execute({ userId });
            return reply.status(200).send({ user });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
};
exports.getUserById = getUserById;
