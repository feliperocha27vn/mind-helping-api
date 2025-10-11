"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const execute_goal_use_case_1 = require("./execute-goal-use-case");
let goalRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Execute old goal', () => {
    (0, vitest_1.beforeEach)(() => {
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new execute_goal_use_case_1.ExecuteGoalUseCase(goalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to execute an old goal', async () => {
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
            userPersonId: person.id,
            description: 'New Goal',
            numberDays: 30,
        });
        const { goal } = await sut.execute({
            goalId: createdGoal.id,
            personId: person.id,
        });
        (0, vitest_1.expect)(goal).toEqual(vitest_1.expect.objectContaining({
            isExecuted: true,
        }));
    });
    (0, vitest_1.it)('should not be able to update a target that does not exist', async () => {
        (0, vitest_1.expect)(async () => await sut.execute({
            goalId: 'non-existing-goal-id',
            personId: 'non-existing-person-id',
        }));
    });
});
