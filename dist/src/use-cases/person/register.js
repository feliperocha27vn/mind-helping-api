"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const email_already_exists_error_1 = require("@/errors/email-already-exists-error");
const bcryptjs_1 = require("bcryptjs");
const invalid_parameters_1 = require("../../errors/invalid-parameters");
class RegisterUseCase {
    registerPersonRepository;
    constructor(registerPersonRepository) {
        this.registerPersonRepository = registerPersonRepository;
    }
    async execute({ name, birth_date, cpf, address, neighborhood, number, complement, cepUser, city, uf, phone, email, password, }) {
        const password_hash = await (0, bcryptjs_1.hash)(password, 6);
        const cleanCep = cepUser.replace('-', '');
        const cep = /^\d{8}$/.test(cleanCep);
        if (!cep) {
            throw new invalid_parameters_1.InvalidParametersError();
        }
        const emailAlreadyExists = await this.registerPersonRepository.findByEmail(email);
        if (emailAlreadyExists) {
            throw new email_already_exists_error_1.EmailAlreadyExistsError();
        }
        const person = await this.registerPersonRepository.create({
            name,
            birth_date,
            cpf,
            address,
            neighborhood,
            number,
            complement,
            cep: cepUser,
            city,
            uf,
            phone,
            email,
            password_hash,
        });
        return {
            person,
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
