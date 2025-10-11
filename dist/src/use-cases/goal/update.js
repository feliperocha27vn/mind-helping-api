"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGoalUseCase = void 0;
const goal_can_only_be_executed_once_1 = require("@/errors/goal-can-only-be-executed-once");
const invalid_parameters_1 = require("@/errors/invalid-parameters");
class UpdateGoalUseCase {
    goalRepository;
    personRepository;
    constructor(goalRepository, personRepository) {
        this.goalRepository = goalRepository;
        this.personRepository = personRepository;
    }
    async execute({ userPersonId, goalId, description, numberDays, }) {
        const person = await this.personRepository.findById(userPersonId);
        if (!person) {
            throw new invalid_parameters_1.InvalidParametersError();
        }
        const goal = await this.goalRepository.findById(goalId);
        if (!goal) {
            throw new invalid_parameters_1.InvalidParametersError();
        }
        if (goal.isExecuted === true) {
            throw new goal_can_only_be_executed_once_1.GoalCanOnlyBeExecutedOnceError();
        }
        const updatedGoal = await this.goalRepository.update(goalId, userPersonId, {
            description,
            numberDays,
        });
        return { goal: updatedGoal };
    }
}
exports.UpdateGoalUseCase = UpdateGoalUseCase;
