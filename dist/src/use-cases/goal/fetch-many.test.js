"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_existing_goals_registred_1 = require("@/errors/not-existing-goals-registred");
const person_not_found_1 = require("@/errors/person-not-found");
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const fetch_many_1 = require("./fetch-many");
let goalRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Fetch Many Goals', () => {
    (0, vitest_1.beforeEach)(() => {
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new fetch_many_1.FetchManyGoalsUseCase(goalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able to fetch many goals', async () => {
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
        await goalRepository.create({
            userPersonId: person.id,
            description: 'New Goal',
            numberDays: 30,
        });
        await goalRepository.create({
            userPersonId: person.id,
            description: 'New Goal 2',
            numberDays: 15,
        });
        const goals = await sut.execute({
            personId: person.id,
        });
        (0, vitest_1.expect)(goals).toEqual({
            goals: [
                vitest_1.expect.objectContaining({
                    userPersonId: person.id,
                    description: 'New Goal',
                    numberDays: 30,
                }),
                vitest_1.expect.objectContaining({
                    userPersonId: person.id,
                    description: 'New Goal 2',
                    numberDays: 15,
                }),
            ],
        });
    });
    (0, vitest_1.it)('should not able to fetch many goals for a non-existing person', async () => {
        (0, vitest_1.expect)(() => sut.execute({
            personId: 'non-existing-person-id',
        })).rejects.toThrow(person_not_found_1.PersonNotFoundError);
    });
    (0, vitest_1.it)('should not able to fetch many goals if person not registered goal', async () => {
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
        (0, vitest_1.expect)(() => sut.execute({
            personId: person.id,
        })).rejects.toThrow(not_existing_goals_registred_1.NotExistingGoalsRegisteredError);
    });
});
