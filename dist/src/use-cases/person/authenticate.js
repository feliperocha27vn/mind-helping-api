"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatePersonUseCase = void 0;
const invalid_credentials_1 = require("@/errors/invalid-credentials");
const bcryptjs_1 = require("bcryptjs");
class AuthenticatePersonUseCase {
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async execute({ email, password, }) {
        const person = await this.personRepository.findByEmail(email);
        if (!person) {
            throw new invalid_credentials_1.InvalidCredentialsError();
        }
        const doesPasswordMatch = await (0, bcryptjs_1.compare)(password, person.password_hash);
        if (!doesPasswordMatch) {
            throw new invalid_credentials_1.InvalidCredentialsError();
        }
        return {
            user: {
                isAuthenticated: true,
                userId: person.id,
            },
        };
    }
}
exports.AuthenticatePersonUseCase = AuthenticatePersonUseCase;
