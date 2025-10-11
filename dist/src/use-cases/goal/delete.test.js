"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const delete_1 = require("./delete");
let goalRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Delete Goal', () => {
    (0, vitest_1.beforeEach)(() => {
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new delete_1.DeleteGoalUseCase(goalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to delete goal', async () => {
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
        await sut.execute({
            goalId: createdGoal.id,
            personId: person.id,
        });
        const goal = await goalRepository.findById(createdGoal.id);
        (0, vitest_1.expect)(goal).toBeNull();
    });
    (0, vitest_1.it)('should be not able to delete goal', async () => {
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
        (0, vitest_1.expect)(async () => await sut.execute({
            goalId: 'no-exists-goal',
            personId: person.id,
        })).rejects.toThrow(resource_not_found_error_1.ResourceNotFoundError);
    });
});
