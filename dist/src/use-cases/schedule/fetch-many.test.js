"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_existing_schedules_1 = require("@/errors/not-existing-schedules");
const person_not_found_1 = require("@/errors/person-not-found");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_professional_repository_1 = require("@/in-memory-repository/in-memory-professional-repository");
const in_memory_schedule_repository_1 = require("@/in-memory-repository/in-memory-schedule-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const fetch_many_1 = require("./fetch-many");
let personRepository;
let professionalRepository;
let scheduleRepository;
let sut;
(0, vitest_1.describe)('Fetch schedules use case', () => {
    (0, vitest_1.beforeEach)(() => {
        scheduleRepository = new in_memory_schedule_repository_1.InMemoryScheduleRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        sut = new fetch_many_1.FetchManySchedulesUseCase(scheduleRepository, professionalRepository);
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to fetch schedules', async () => {
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
        const professinal = await professionalRepository.create({
            crp: '06/12345',
            person_id: person.id,
            voluntary: false,
        });
        await scheduleRepository.create({
            id: 'schedule-01',
            professionalPersonId: professinal.person_id,
            initialTime: new Date('2024-12-01T10:00:00'),
            endTime: new Date('2024-12-01T11:00:00'),
            interval: 30,
            cancellationPolicy: 24,
            averageValue: 100,
            observation: 'Consulta de rotina',
            isControlled: false,
        });
        const { schedules } = await sut.execute({
            professionalId: professinal.person_id,
        });
        (0, vitest_1.expect)(schedules).toHaveLength(1);
    });
    (0, vitest_1.it)('should not be able to fetch schedules, if professional does not exist', async () => {
        (0, vitest_1.expect)(() => sut.execute({
            professionalId: 'non-existing-professional-id',
        })).rejects.toThrow(person_not_found_1.PersonNotFoundError);
    });
    (0, vitest_1.it)('should not be able to fetch schedules, if schedule does not exist', async () => {
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
        const professinal = await professionalRepository.create({
            crp: '06/12345',
            person_id: person.id,
            voluntary: false,
        });
        (0, vitest_1.expect)(() => sut.execute({
            professionalId: professinal.person_id,
        })).rejects.toThrow(not_existing_schedules_1.NotExistingSchedulesError);
    });
});
