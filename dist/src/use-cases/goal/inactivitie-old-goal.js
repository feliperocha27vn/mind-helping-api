"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InactivateOldGoalUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const date_fns_1 = require("date-fns");
class InactivateOldGoalUseCase {
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
        const daysPassed = (0, date_fns_1.differenceInDays)(new Date(), goal.createdAt);
        if (daysPassed > 30) {
            this.goalRepository.updateInactivateOldGoal(goalId, personId);
        }
        return {
            goal,
        };
    }
}
exports.InactivateOldGoalUseCase = InactivateOldGoalUseCase;
