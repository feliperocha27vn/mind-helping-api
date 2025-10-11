"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_not_valid_1 = require("@/errors/date-not-valid");
const in_memory_feelings_repository_1 = require("@/in-memory-repository/in-memory-feelings-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_user_repository_1 = require("@/in-memory-repository/in-memory-user-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const get_feelings_by_date_1 = require("./get-feelings-by-date");
let userRepository;
let personRepository;
let feelingsRepository;
let sut;
(0, vitest_1.describe)('Get feelings by date use case', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
        userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        feelingsRepository = new in_memory_feelings_repository_1.InMemoryFeelingsRepository();
        sut = new get_feelings_by_date_1.GetFeelingsByDateUseCase(personRepository, userRepository, feelingsRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able get a feelings by date user', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-06-10T10:00:00'));
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
        const { feelings } = await sut.execute({
            userId: user.person_id,
            day: new Date('2024-06-10'),
        });
        (0, vitest_1.expect)(feelings).toHaveLength(2);
    });
    (0, vitest_1.it)('should not be able get a feelings by date with invalid userId', async () => {
        await (0, vitest_1.expect)(() => sut.execute({
            userId: 'invalid-user-id',
            day: new Date('2024-06-10'),
        })).rejects.toThrowError('Person not found');
    });
    (0, vitest_1.it)('should not be able get a feelings by date with invalid date', async () => {
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
            gender: 'female',
            person_id: person.id,
        });
        await (0, vitest_1.expect)(() => sut.execute({
            userId: person.id,
            day: new Date('invalid-date'),
        })).rejects.toThrowError(date_not_valid_1.DateNotValidError);
    });
});
