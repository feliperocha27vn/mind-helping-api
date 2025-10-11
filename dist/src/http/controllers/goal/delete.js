"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = void 0;
const person_not_found_1 = require("@/errors/person-not-found");
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_delete_goal_use_case_1 = require("@/factories/goal/make-delete-goal-use-case");
const v4_1 = require("zod/v4");
const deleteGoal = async (app) => {
    app.delete('/goal/:goalId/:personId', {
        schema: {
            tags: ['Goal'],
            params: v4_1.z.object({
                goalId: v4_1.z.uuid(),
                personId: v4_1.z.uuid(),
            }),
            response: {
                204: v4_1.z.void(),
                404: v4_1.z.object({ message: v4_1.z.string() }),
                500: v4_1.z.object({ message: v4_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        const { goalId, personId } = request.params;
        const deleteGoalUseCase = (0, make_delete_goal_use_case_1.makeDeleteGoalUseCase)();
        try {
            await deleteGoalUseCase.execute({ goalId, personId });
            return reply.status(204).send();
        }
        catch (error) {
            if (error instanceof person_not_found_1.PersonNotFoundError ||
                error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
};
exports.deleteGoal = deleteGoal;
