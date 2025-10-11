"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchManyGoalsUseCase = void 0;
const not_existing_goals_registred_1 = require("@/errors/not-existing-goals-registred");
const person_not_found_1 = require("@/errors/person-not-found");
class FetchManyGoalsUseCase {
    goalRepository;
    personRepository;
    constructor(goalRepository, personRepository) {
        this.goalRepository = goalRepository;
        this.personRepository = personRepository;
    }
    async execute({ personId, }) {
        const person = await this.personRepository.findById(personId);
        if (!person) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const goals = await this.goalRepository.fetchManyGoals(personId);
        if (!goals) {
            throw new not_existing_goals_registred_1.NotExistingGoalsRegisteredError();
        }
        return { goals };
    }
}
exports.FetchManyGoalsUseCase = FetchManyGoalsUseCase;
