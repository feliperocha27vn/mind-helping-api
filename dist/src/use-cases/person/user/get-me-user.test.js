"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_feelings_repository_1 = require("@/in-memory-repository/in-memory-feelings-repository");
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_user_repository_1 = require("@/in-memory-repository/in-memory-user-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const get_me_user_1 = require("./get-me-user");
let userRepository;
let personRepository;
let feelingsRepository;
let goalRepository;
let sut;
(0, vitest_1.describe)('Get me user use case', () => {
    (0, vitest_1.beforeEach)(() => {
        userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        feelingsRepository = new in_memory_feelings_repository_1.InMemoryFeelingsRepository();
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        sut = new get_me_user_1.GetMeUserUseCase(personRepository, feelingsRepository, goalRepository);
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
        await feelingsRepository.create({
            description: 'ANSIOSO',
            motive: 'Amanhã tenho uma entrevista de emprego!',
            userPersonId: user.person_id,
        });
        await feelingsRepository.create({
            description: 'FELIZ',
            motive: 'Consegui um novo emprego!',
            userPersonId: user.person_id,
        });
        const { profile } = await sut.execute({ userId: user.person_id });
        (0, vitest_1.expect)(profile.nameUser).toEqual('Maria Silva Santos');
        (0, vitest_1.expect)(profile.countExecutedGoals).toEqual(0);
    });
});
