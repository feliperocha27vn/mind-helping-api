"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCounter = void 0;
const person_not_found_1 = require("@/errors/person-not-found");
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_add_counter_goal_use_case_1 = require("@/factories/goal/make-add-counter-goal-use-case");
const zod_1 = __importDefault(require("zod"));
const addCounter = async (app) => {
    app.patch('/goal/counter/:goalId/:personId', {
        schema: {
            tags: ['Goal'],
            params: zod_1.default.object({
                goalId: zod_1.default.string(),
                personId: zod_1.default.string(),
            }),
            response: {
                200: zod_1.default.void(),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { goalId, personId } = request.params;
        const addCounterGoalUseCase = (0, make_add_counter_goal_use_case_1.makeAddCounterGoalUseCase)();
        try {
            await addCounterGoalUseCase.execute({ goalId, personId });
            return reply.status(200).send();
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            if (error instanceof person_not_found_1.PersonNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
};
exports.addCounter = addCounter;
