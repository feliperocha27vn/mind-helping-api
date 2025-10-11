"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_feelings_repository_1 = require("@/in-memory-repository/in-memory-feelings-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_user_repository_1 = require("@/in-memory-repository/in-memory-user-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const create_1 = require("./create");
let userRepository;
let personRepository;
let feelingsRepository;
let sut;
(0, vitest_1.describe)('Create feeling user use case', () => {
    (0, vitest_1.beforeEach)(() => {
        userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        feelingsRepository = new in_memory_feelings_repository_1.InMemoryFeelingsRepository();
        sut = new create_1.CreateFeelingUserUseCase(feelingsRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to create a feeling user', async () => {
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
        const user = await userRepository.create({
            gender: 'female',
            person_id: person.id,
        });
        const { feelingsUser } = await sut.execute({
            description: 'FELIZ',
            motive: 'Consegui um novo emprego!',
            userPersonId: user.person_id,
        });
        (0, vitest_1.expect)(feelingsUser.id).toEqual(vitest_1.expect.any(String));
    });
});
