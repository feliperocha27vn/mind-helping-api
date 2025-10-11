"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const goal_can_only_be_executed_once_1 = require("@/errors/goal-can-only-be-executed-once");
const invalid_parameters_1 = require("@/errors/invalid-parameters");
const make_update_goal_use_case_1 = require("@/factories/goal/make-update-goal-use-case");
const zod_1 = __importDefault(require("zod"));
const update = async (app) => {
    app.patch('/goal/update/:goalId/:personId', {
        schema: {
            tags: ['Goal'],
            params: zod_1.default.object({
                goalId: zod_1.default.uuid(),
                personId: zod_1.default.uuid(),
            }),
            body: zod_1.default.object({
                description: zod_1.default.string().max(255).optional(),
                numberDays: zod_1.default.number().min(1).optional(),
            }),
            response: {
                200: zod_1.default.void(),
                400: zod_1.default.object({ message: zod_1.default.string() }),
                409: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { goalId, personId } = request.params;
        const { description, numberDays } = request.body;
        const updateGoalUseCase = (0, make_update_goal_use_case_1.makeUpdateGoalUseCase)();
        try {
            await updateGoalUseCase.execute({
                goalId,
                userPersonId: personId,
                description,
                numberDays,
            });
            return reply.status(200).send();
        }
        catch (error) {
            if (error instanceof invalid_parameters_1.InvalidParametersError) {
                return reply.status(400).send({ message: error.message });
            }
            if (error instanceof goal_can_only_be_executed_once_1.GoalCanOnlyBeExecutedOnceError) {
                return reply.status(409).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
};
exports.update = update;
