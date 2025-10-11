"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_not_valid_1 = require("@/errors/date-not-valid");
const in_memory_hourly_repository_1 = require("@/in-memory-repository/in-memory-hourly-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_professional_repository_1 = require("@/in-memory-repository/in-memory-professional-repository");
const in_memory_schedule_repository_1 = require("@/in-memory-repository/in-memory-schedule-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const create_1 = require("./create");
let personRepository;
let professionalRepository;
let hourlyRepository;
let scheduleRepository;
let sut;
(0, vitest_1.describe)('Create schedule use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        hourlyRepository = new in_memory_hourly_repository_1.InMemoryHourlyRepository();
        scheduleRepository = new in_memory_schedule_repository_1.InMemoryScheduleRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        sut = new create_1.CreateScheduleUseCase(scheduleRepository, hourlyRepository, professionalRepository);
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to create a new schedule', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-12-01T10:00:00'));
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
        const { schedule } = await sut.execute({
            professionalPersonId: professinal.person_id,
            schedules: [
                {
                    averageValue: 150,
                    cancellationPolicy: 24,
                    initialTime: new Date('2024-12-30T09:00:00'),
                    endTime: new Date('2024-12-30T18:00:00'),
                    interval: 60,
                    isControlled: true,
                    observation: 'Atendimento presencial',
                },
                {
                    averageValue: 150,
                    cancellationPolicy: 12,
                    initialTime: new Date('2024-12-31T09:00:00'),
                    endTime: new Date('2024-12-31T18:00:00'),
                    interval: 60,
                    isControlled: true,
                    observation: 'Atendimento presencial',
                },
            ],
        });
        (0, vitest_1.expect)(schedule).toEqual(vitest_1.expect.any(Array));
    });
    (0, vitest_1.it)('should not be able to create a new schedule with initial time before the current date', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-12-01T10:00:00'));
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
        await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: false,
        });
        await (0, vitest_1.expect)(() => sut.execute({
            professionalPersonId: person.id,
            schedules: [
                {
                    averageValue: 150,
                    cancellationPolicy: 24,
                    initialTime: new Date('2024-11-30T09:00:00'),
                    endTime: new Date('2024-11-30T18:00:00'),
                    interval: 60,
                    isControlled: true,
                    observation: 'Atendimento presencial',
                },
            ],
        })).rejects.toBeInstanceOf(date_not_valid_1.DateNotValidError);
    });
    (0, vitest_1.it)('should be able create professional voluntary', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-12-01T10:00:00'));
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
            voluntary: true,
        });
        const { schedule } = await sut.execute({
            professionalPersonId: professinal.person_id,
            schedules: [
                {
                    averageValue: 150,
                    cancellationPolicy: 24,
                    initialTime: new Date('2024-12-31T09:00:00'),
                    endTime: new Date('2024-12-31T18:00:00'),
                    interval: 60,
                    isControlled: true,
                    observation: 'Atendimento presencial',
                },
            ],
        });
        (0, vitest_1.expect)(schedule[0].averageValue.toNumber()).toEqual(0);
    });
});
