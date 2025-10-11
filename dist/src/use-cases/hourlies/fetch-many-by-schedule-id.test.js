"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_hourly_repository_1 = require("@/in-memory-repository/in-memory-hourly-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_professional_repository_1 = require("@/in-memory-repository/in-memory-professional-repository");
const in_memory_schedule_repository_1 = require("@/in-memory-repository/in-memory-schedule-repository");
const create_1 = require("@/use-cases/schedule/create");
const vitest_1 = require("vitest");
const fetch_many_by_schedule_id_1 = require("./fetch-many-by-schedule-id");
let hourlyRepository;
let scheduleRepository;
let personRepository;
let professionalRepository;
let createScheduleUseCase;
let sut;
(0, vitest_1.describe)('Fetch many hourlies by schedule id use case', () => {
    (0, vitest_1.beforeEach)(() => {
        hourlyRepository = new in_memory_hourly_repository_1.InMemoryHourlyRepository();
        scheduleRepository = new in_memory_schedule_repository_1.InMemoryScheduleRepository();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        createScheduleUseCase = new create_1.CreateScheduleUseCase(scheduleRepository, hourlyRepository, professionalRepository);
        sut = new fetch_many_by_schedule_id_1.FetchManyHourliesByScheduleIdUseCase(hourlyRepository, scheduleRepository);
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to fetch many hourlies by schedule id', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-12-01T10:00:00'));
        // Primeiro criamos uma pessoa
        const person = await personRepository.create({
            id: 'professional-1',
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
            password_hash: 'hashed-password',
        });
        // Depois criamos o profissional
        await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: true,
        });
        // Usa o CreateScheduleUseCase para criar o schedule E os hourlies automaticamente
        const { schedule } = await createScheduleUseCase.execute({
            professionalPersonId: 'professional-1',
            schedules: [
                {
                    averageValue: 150,
                    cancellationPolicy: 24,
                    initialTime: new Date('2024-12-31T09:00:00.000Z'),
                    endTime: new Date('2024-12-31T18:00:00.000Z'),
                    interval: 60,
                    isControlled: true, // Importante: true para criar os hourlies automaticamente
                    observation: 'Atendimento presencial',
                },
            ],
        });
        const { hourlies } = await sut.execute({ scheduleId: schedule[0].id });
        // Com intervalo de 60 minutos, de 09:00 às 18:00 UTC, devem ser criados 9 hourlies
        // 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00
        (0, vitest_1.expect)(hourlies).toHaveLength(9);
        (0, vitest_1.expect)(hourlies[0].scheduleId).toBe(schedule[0].id);
        (0, vitest_1.expect)(hourlies[0].hour).toBe('09:00');
        (0, vitest_1.expect)(hourlies[8].hour).toBe('17:00');
    });
});
