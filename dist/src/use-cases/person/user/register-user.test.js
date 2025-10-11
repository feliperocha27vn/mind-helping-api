"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_user_repository_1 = require("@/in-memory-repository/in-memory-user-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const register_user_1 = require("./register-user");
let userRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Register user use case', () => {
    (0, vitest_1.beforeEach)(() => {
        userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new register_user_1.RegisterUserUseCase(userRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to register a user', async () => {
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cep: '01234-567',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const { user } = await sut.execute({
            person_id: person.id,
            gender: 'female',
        });
        (0, vitest_1.expect)(user.person_id).toEqual(vitest_1.expect.any(String));
    });
});
