"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByIdUseCase = void 0;
const person_not_found_1 = require("@/errors/person-not-found");
class GetUserByIdUseCase {
    personRepository;
    userRepository;
    constructor(personRepository, userRepository) {
        this.personRepository = personRepository;
        this.userRepository = userRepository;
    }
    async execute({ userId, }) {
        const person = await this.personRepository.findById(userId);
        if (!person) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const user = await this.userRepository.getById(userId);
        if (!user) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        return {
            user: {
                name: person.name,
                birthDate: person.birth_date,
                phone: person.phone,
                email: person.email,
                cpf: person.cpf,
                gender: user.gender,
                address: {
                    street: person.address,
                    neighborhood: person.neighborhood,
                    number: person.number,
                    cep: person.cep,
                    city: person.city,
                },
            },
        };
    }
}
exports.GetUserByIdUseCase = GetUserByIdUseCase;
