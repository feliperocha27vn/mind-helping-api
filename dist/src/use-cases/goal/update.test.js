"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const goal_can_only_be_executed_once_1 = require("@/errors/goal-can-only-be-executed-once");
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const update_1 = require("./update");
let goalRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Update Goal', () => {
    (0, vitest_1.beforeEach)(() => {
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new update_1.UpdateGoalUseCase(goalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to update goal', async () => {
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
            userPersonId: person.id,
            description: 'Updated Goal',
            numberDays: 15,
        });
        (0, vitest_1.expect)(goal).toEqual(vitest_1.expect.objectContaining({
            description: 'Updated Goal',
        }));
    });
    (0, vitest_1.it)('should not be able update goal executed', async () => {
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
        await goalRepository.updateExecuteGoal(createdGoal.id, person.id);
        (0, vitest_1.expect)(() => sut.execute({
            goalId: createdGoal.id,
            userPersonId: person.id,
            description: 'Updated Goal',
            numberDays: 15,
        })).rejects.toThrowError(goal_can_only_be_executed_once_1.GoalCanOnlyBeExecutedOnceError);
    });
});
