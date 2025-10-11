"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const resource_not_found_error_1 = require("../../../errors/resource-not-found-error");
class RegisterUserUseCase {
    userRepository;
    personRepository;
    constructor(userRepository, personRepository) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
    }
    async execute({ person_id, gender, }) {
        const person = await this.personRepository.findById(person_id);
        if (!person) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const user = await this.userRepository.create({
            person_id: person.id,
            gender: gender ?? 'Não definido',
        });
        return {
            user,
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
