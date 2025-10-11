"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeGoal = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_execute_goal_use_case_1 = require("@/factories/goal/make-execute-goal-use-case");
const v4_1 = require("zod/v4");
const executeGoal = async (app) => {
    app.patch('/goal/execute/:goalId/:personId', {
        schema: {
            tags: ['Goal'],
            params: v4_1.z.object({
                goalId: v4_1.z.uuid(),
                personId: v4_1.z.uuid(),
            }),
            response: {
                200: v4_1.z.object({ message: v4_1.z.string() }),
                404: v4_1.z.object({ message: v4_1.z.string() }),
                500: v4_1.z.object({ message: v4_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        const { goalId, personId } = request.params;
        const executeGoalUseCase = (0, make_execute_goal_use_case_1.makeExecuteGoalUseCase)();
        try {
            await executeGoalUseCase.execute({ goalId, personId });
            return reply.status(200).send();
        }
        catch (error) {
            console.log('Error executing goal:', error);
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
};
exports.executeGoal = executeGoal;
