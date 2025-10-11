"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeelingsByDateUser = void 0;
const date_not_valid_1 = require("@/errors/date-not-valid");
const person_not_found_1 = require("@/errors/person-not-found");
const make_get_feelings_by_date_use_case_1 = require("@/factories/feelings-user/make-get-feelings-by-date-use-case");
const zod_1 = __importDefault(require("zod"));
const getFeelingsByDateUser = async (app) => {
    app.get('/feelings/:userId', {
        schema: {
            tags: ['Feelings'],
            params: zod_1.default.object({
                userId: zod_1.default.uuid(),
            }),
            querystring: zod_1.default.object({
                startDay: zod_1.default.coerce.date(),
                endDay: zod_1.default.coerce.date(),
            }),
            response: {
                200: zod_1.default.object({
                    feelings: zod_1.default
                        .object({
                        description: zod_1.default.enum([
                            'TRISTE',
                            'ANSIOSO',
                            'TEDIO',
                            'RAIVA',
                            'NÃO_SEI_DIZER',
                            'FELIZ',
                        ]),
                        id: zod_1.default.uuid(),
                        motive: zod_1.default.string().nullable(),
                        userPersonId: zod_1.default.string(),
                        createdAt: zod_1.default.date(),
                        updatedAt: zod_1.default.date(),
                    })
                        .array(),
                }),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                422: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { userId } = request.params;
        const { startDay, endDay } = request.query;
        const getFeelingsByDateUseCase = (0, make_get_feelings_by_date_use_case_1.makeGetFeelingsByDateUseCase)();
        try {
            const { feelings } = await getFeelingsByDateUseCase.execute({
                userId,
                startDay,
                endDay,
            });
            return reply.status(200).send({ feelings });
        }
        catch (error) {
            if (error instanceof person_not_found_1.PersonNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            if (error instanceof date_not_valid_1.DateNotValidError) {
                return reply.status(422).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.getFeelingsByDateUser = getFeelingsByDateUser;
