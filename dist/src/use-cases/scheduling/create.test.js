"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_hourly_repository_1 = require("@/in-memory-repository/in-memory-hourly-repository");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_professional_repository_1 = require("@/in-memory-repository/in-memory-professional-repository");
const in_memory_schedule_repository_1 = require("@/in-memory-repository/in-memory-schedule-repository");
const in_memory_scheduling_repository_1 = require("@/in-memory-repository/in-memory-scheduling-repository");
const in_memory_user_repository_1 = require("@/in-memory-repository/in-memory-user-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const create_1 = require("./create");
let userRepository;
let professionalRepository;
let hourlyRepository;
let personRepository;
let schedulingRepository;
let scheduleRepository;
let sut;
(0, vitest_1.describe)('Create scheduling use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        hourlyRepository = new in_memory_hourly_repository_1.InMemoryHourlyRepository();
        schedulingRepository = new in_memory_scheduling_repository_1.InMemorySchedulingRepository();
        scheduleRepository = new in_memory_schedule_repository_1.InMemoryScheduleRepository();
        sut = new create_1.CreateSchedulingUseCase(scheduleRepository, schedulingRepository, hourlyRepository, professionalRepository, userRepository);
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to create a scheduling', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-12-01T10:00:00'));
        const professionalPerson = await personRepository.create({
            id: 'person-01',
            name: 'Dr. Maria Silva Santos',
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
        const professional = await professionalRepository.create({
            person_id: professionalPerson.id,
            crp: '123456789',
            voluntary: false,
        });
        const userPerson = await personRepository.create({
            id: 'person-02',
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
            person_id: userPerson.id,
        });
        const schedule = await scheduleRepository.create({
            professionalPersonId: professional.person_id,
            averageValue: 150,
            cancellationPolicy: 24,
            initialTime: new Date('2024-12-31T09:00:00.000Z'),
            endTime: new Date('2024-12-31T18:00:00.000Z'),
            interval: 60,
            isControlled: true,
            observation: 'Atendimento presencial',
        });
        await hourlyRepository.createHourlySlots(schedule.id, schedule.initialTime, schedule.endTime, schedule.interval);
        const { scheduling } = await sut.execute({
            professionalPersonId: professional.person_id,
            userPersonId: user.person_id,
            scheduleId: schedule.id,
            date: '2024-12-31',
            hour: '10:00',
        });
        const hourly = await hourlyRepository.getById(scheduling.hourlyId);
        (0, vitest_1.expect)(scheduling.id).toEqual(vitest_1.expect.any(String));
        (0, vitest_1.expect)(hourly?.isOcuped).toBe(true);
    });
});
