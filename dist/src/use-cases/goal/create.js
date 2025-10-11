"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGoalUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class CreateGoalUseCase {
    goalRepository;
    personRepository;
    constructor(goalRepository, personRepository) {
        this.goalRepository = goalRepository;
        this.personRepository = personRepository;
    }
    async execute({ userPersonId, description, numberDays, }) {
        const person = await this.personRepository.findById(userPersonId);
        if (!person) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const goal = await this.goalRepository.create({
            userPersonId,
            description,
            numberDays,
        });
        return {
            goal,
        };
    }
}
exports.CreateGoalUseCase = CreateGoalUseCase;
