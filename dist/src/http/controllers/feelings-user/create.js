"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeelingsUser = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_create_feeling_user_use_case_1 = require("@/factories/feelings-user/make-create-feeling-user-use-case");
const zod_1 = __importDefault(require("zod"));
const createFeelingsUser = async (app) => {
    app.post('/feelings/:userId', {
        schema: {
            tags: ['Feelings'],
            params: zod_1.default.object({
                userId: zod_1.default.uuid(),
            }),
            body: zod_1.default.object({
                description: zod_1.default.enum([
                    'TRISTE',
                    'ANSIOSO',
                    'TEDIO',
                    'RAIVA',
                    'NÃO_SEI_DIZER',
                    'FELIZ',
                ]),
                motive: zod_1.default.string().nullable().optional(),
            }),
            response: {
                201: zod_1.default.void(),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { userId } = request.params;
        const { description, motive } = request.body;
        const createFeelingUserUseCase = (0, make_create_feeling_user_use_case_1.makeCreateFeelingUserUseCase)();
        try {
            await createFeelingUserUseCase.execute({
                userPersonId: userId,
                description,
                motive,
            });
            return reply.status(201).send();
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.createFeelingsUser = createFeelingsUser;
