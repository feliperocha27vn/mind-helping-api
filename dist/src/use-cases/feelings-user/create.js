"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeelingUserUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class CreateFeelingUserUseCase {
    feelingsRepository;
    personRepository;
    constructor(feelingsRepository, personRepository) {
        this.feelingsRepository = feelingsRepository;
        this.personRepository = personRepository;
    }
    async execute({ description, motive, userPersonId, }) {
        const personUser = await this.personRepository.findById(userPersonId);
        if (!personUser) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const feelingsUser = await this.feelingsRepository.create({
            description,
            motive,
            userPersonId,
        });
        return { feelingsUser };
    }
}
exports.CreateFeelingUserUseCase = CreateFeelingUserUseCase;
