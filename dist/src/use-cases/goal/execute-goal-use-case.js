"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteGoalUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class ExecuteGoalUseCase {
    goalRepository;
    personRepository;
    constructor(goalRepository, personRepository) {
        this.goalRepository = goalRepository;
        this.personRepository = personRepository;
    }
    async execute({ goalId, personId, }) {
        const person = await this.personRepository.findById(personId);
        if (!person) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const goal = await this.goalRepository.findById(goalId);
        if (!goal) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        this.goalRepository.updateExecuteGoal(goalId, personId);
        return {
            goal,
        };
    }
}
exports.ExecuteGoalUseCase = ExecuteGoalUseCase;
