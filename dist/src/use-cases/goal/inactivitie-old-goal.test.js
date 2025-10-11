"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_goal_repository_1 = require("@/in-memory-repository/in-memory-goal-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const inactivitie_old_goal_1 = require("./inactivitie-old-goal");
let goalRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Inactivate old goal', () => {
    (0, vitest_1.beforeEach)(() => {
        goalRepository = new in_memory_goal_repository_1.InMemoryGoalRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        sut = new inactivitie_old_goal_1.InactivateOldGoalUseCase(goalRepository, personRepository);
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to inactivate an old goal', async () => {
        vitest_1.vi.setSystemTime(new Date(2023, 2, 1));
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
        vitest_1.vi.setSystemTime(new Date(2023, 3, 15));
        const { goal } = await sut.execute({
            goalId: createdGoal.id,
            personId: person.id,
        });
        (0, vitest_1.expect)(goal).toEqual(vitest_1.expect.objectContaining({
            isExpire: true,
        }));
    });
    (0, vitest_1.it)('should not be able to inactivate a goal that is not old', async () => {
        vitest_1.vi.setSystemTime(new Date(2023, 3, 15));
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
        vitest_1.vi.setSystemTime(new Date(2023, 4, 15));
        const { goal } = await sut.execute({
            goalId: createdGoal.id,
            personId: person.id,
        });
        (0, vitest_1.expect)(goal).toEqual(vitest_1.expect.objectContaining({
            isExpire: false,
        }));
    });
    (0, vitest_1.it)('should not be able to no inactivate goal non existent', async () => {
        await (0, vitest_1.expect)(() => sut.execute({
            goalId: 'non-existent-goal-id',
            personId: 'non-existent-person-id',
        })).rejects.toThrow('Resource not found');
    });
});
