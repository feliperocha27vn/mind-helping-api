"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const add_counter_1 = require("./add-counter");
let personRepository;
let goalRepository;
let sut;
(0, vitest_1.describe)('Create goal use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        sut = new add_counter_1.AddCounterUseCase(goalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to add a counter to a goal', async () => {
        const person = await personRepository.create({
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
        const createdGoal = await goalRepository.create({
            description: 'New Goal',
            numberDays: 30,
            userPersonId: person.id,
        });
        const { goal } = await sut.execute({
            goalId: createdGoal.id,
            personId: person.id,
        });
        (0, vitest_1.expect)(goal.counter).toEqual(1);
    });
});
