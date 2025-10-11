"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_already_exists_error_1 = require("@/errors/email-already-exists-error");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const invalid_parameters_1 = require("../../errors/invalid-parameters");
const in_memory_person_repository_1 = require("../../in-memory-repository/in-memory-person-repository");
const register_1 = require("./register");
let personRepository;
let sut;
(0, vitest_1.describe)('Register person use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new register_1.RegisterUseCase(personRepository);
    });
    (0, vitest_1.it)('should be able to register new person', async () => {
        const { person } = await sut.execute({
            name: 'Dr. Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cepUser: '01234-567',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password: 'senha123',
        });
        (0, vitest_1.expect)(person.id).toEqual(vitest_1.expect.any(String));
    });
    (0, vitest_1.it)('shoulde be able make hash password', async () => {
        const { person } = await sut.execute({
            name: 'Dr. Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cepUser: '01234-567',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password: 'senha123',
        });
        const isPasswordHash = await (0, bcryptjs_1.compare)('senha123', person.password_hash);
        (0, vitest_1.expect)(isPasswordHash).toBe(true);
    });
    (0, vitest_1.it)('should be able not register a CEP invalid', async () => {
        await (0, vitest_1.expect)(() => sut.execute({
            name: 'Dr. Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cepUser: 'not-valid-cep',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password: 'senha123',
        })).rejects.toBeInstanceOf(invalid_parameters_1.InvalidParametersError);
    });
    (0, vitest_1.it)('should not be able to register a person with email already exists', async () => {
        sut.execute({
            name: 'Dr. Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cepUser: '01234-567',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password: 'senha123',
        });
        await (0, vitest_1.expect)(() => sut.execute({
            name: 'Dr. Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cepUser: '01234-567',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password: 'senha123',
        })).rejects.toBeInstanceOf(email_already_exists_error_1.EmailAlreadyExistsError);
    });
});
