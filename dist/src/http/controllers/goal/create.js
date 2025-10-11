"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_create_goal_use_case_1 = require("@/factories/goal/make-create-goal-use-case");
const v4_1 = require("zod/v4");
const create = async (app) => {
    app.post('/goal', {
        schema: {
            tags: ['Goal'],
            body: v4_1.z.object({
                userPersonId: v4_1.z.string().uuid(),
                description: v4_1.z.string(),
                numberDays: v4_1.z.number().min(1),
            }),
        },
    }, async (request, reply) => {
        const { userPersonId, description, numberDays } = request.body;
        const createGoalUseCase = (0, make_create_goal_use_case_1.makeCreateGoalUseCase)();
        try {
            await createGoalUseCase.execute({
                userPersonId,
                description,
                numberDays,
            });
            return reply.status(201).send();
        }
        catch (error) {
            console.log('Error details:', error); // Debug log
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(400).send({
                    message: error.message,
                });
            }
            // Tratar outros erros
            return reply.status(500).send({
                message: 'Internal server error',
            });
        }
    });
};
exports.create = create;
