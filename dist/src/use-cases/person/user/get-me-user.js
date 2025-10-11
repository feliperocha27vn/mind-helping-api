"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMeUserUseCase = void 0;
const person_not_found_1 = require("@/errors/person-not-found");
class GetMeUserUseCase {
    personRepository;
    feelingsRepository;
    goalRepository;
    constructor(personRepository, feelingsRepository, goalRepository) {
        this.personRepository = personRepository;
        this.feelingsRepository = feelingsRepository;
        this.goalRepository = goalRepository;
    }
    async execute({ userId, }) {
        const personUser = await this.personRepository.findById(userId);
        if (!personUser) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const lastFeeling = await this.feelingsRepository.getLastFeelingsByUserId(userId);
        const countExecutedGoals = await this.goalRepository.getCountExecutedGoals(personUser.id);
        const profile = {
            nameUser: personUser.name,
            cityAndUf: {
                city: personUser.city,
                uf: personUser.uf,
            },
            lastFeeling: lastFeeling?.description ?? undefined,
            countExecutedGoals: countExecutedGoals ?? 0,
        };
        return { profile };
    }
}
exports.GetMeUserUseCase = GetMeUserUseCase;
