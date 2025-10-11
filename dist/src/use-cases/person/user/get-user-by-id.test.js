"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_user_repository_1 = require("@/in-memory-repository/in-memory-user-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const get_user_by_id_1 = require("./get-user-by-id");
let userRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Get user by ID use case', () => {
    (0, vitest_1.beforeEach)(() => {
        userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new get_user_by_id_1.GetUserByIdUseCase(personRepository, userRepository);
    });
    (0, vitest_1.it)('should be able to get a user by ID', async () => {
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
        await userRepository.create({
            person_id: person.id,
            gender: 'female',
        });
        const { user } = await sut.execute({
            userId: person.id,
        });
        (0, vitest_1.expect)(user.name).toEqual('Maria Silva Santos');
    });
});
