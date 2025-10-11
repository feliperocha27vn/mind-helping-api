"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCounterUseCase = void 0;
const person_not_found_1 = require("@/errors/person-not-found");
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class AddCounterUseCase {
    goalRepository;
    personRepository;
    constructor(goalRepository, personRepository) {
        this.goalRepository = goalRepository;
        this.personRepository = personRepository;
    }
    async execute({ goalId, personId, }) {
        const person = await this.personRepository.findById(personId);
        if (!person) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const goal = await this.goalRepository.findById(goalId);
        if (!goal) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        if (goal.counter <= goal.numberDays) {
            this.goalRepository.addCounter(goalId, personId);
        }
        return { goal };
    }
}
exports.AddCounterUseCase = AddCounterUseCase;
