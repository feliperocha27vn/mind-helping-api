"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const create_1 = require("./create");
let personRepository;
let goalRepository;
let sut;
(0, vitest_1.describe)('Create goal use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        sut = new create_1.CreateGoalUseCase(goalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to create a new goal', async () => {
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
        const { goal } = await sut.execute({
            userPersonId: person.id,
            description: 'New Goal',
            numberDays: 30,
        });
        (0, vitest_1.expect)(goal.id).toEqual(vitest_1.expect.any(String));
    });
    (0, vitest_1.it)('should not be able to create a goal for a non-existing person', async () => {
        await (0, vitest_1.expect)(() => sut.execute({
            userPersonId: 'non-existing-person-id',
            description: 'New Goal',
            numberDays: 30,
        })).rejects.toBeInstanceOf(resource_not_found_error_1.ResourceNotFoundError);
    });
});
