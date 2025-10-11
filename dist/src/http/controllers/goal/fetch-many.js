"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fechMany = void 0;
const not_existing_goals_registred_1 = require("@/errors/not-existing-goals-registred");
const person_not_found_1 = require("@/errors/person-not-found");
const make_fetch_many_goals_use_case_1 = require("@/factories/goal/make-fetch-many-goals-use-case");
const zod_1 = __importDefault(require("zod"));
const fechMany = async (app) => {
    app.get('/goals/:personId', {
        schema: {
            tags: ['Goal'],
            params: zod_1.default.object({
                personId: zod_1.default.uuid(),
            }),
            response: {
                200: zod_1.default.object({
                    goals: zod_1.default.array(zod_1.default.object({
                        id: zod_1.default.string(),
                        description: zod_1.default.string(),
                        userPersonId: zod_1.default.string(),
                        numberDays: zod_1.default.number(),
                        isExecuted: zod_1.default.boolean(),
                        isExpire: zod_1.default.boolean(),
                        counter: zod_1.default.number(),
                        createdAt: zod_1.default.date(),
                        updatedAt: zod_1.default.date(),
                    })),
                }),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { personId } = request.params;
        const fetchManyGoalsUseCase = (0, make_fetch_many_goals_use_case_1.makeFetchManyGoalsUseCase)();
        try {
            const { goals } = await fetchManyGoalsUseCase.execute({ personId });
            return reply.status(200).send({ goals });
        }
        catch (error) {
            if (error instanceof person_not_found_1.PersonNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            if (error instanceof not_existing_goals_registred_1.NotExistingGoalsRegisteredError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
};
exports.fechMany = fechMany;
