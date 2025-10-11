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
const get_by_user_id_1 = require("./get-by-user-id");
let hourlyRepository;
let personRepository;
let schedulingRepository;
let sut;
(0, vitest_1.describe)('Get scheduling use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        hourlyRepository = new in_memory_hourly_repository_1.InMemoryHourlyRepository();
        schedulingRepository = new in_memory_scheduling_repository_1.InMemorySchedulingRepository();
        sut = new get_by_user_id_1.GetSchedulingUseCase(schedulingRepository, personRepository, hourlyRepository);
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to get a scheduling', async () => {
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
        const professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
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
        const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
        const user = await userRepository.create({
            gender: 'female',
            person_id: userPerson.id,
        });
        const scheduleRepository = new in_memory_schedule_repository_1.InMemoryScheduleRepository();
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
        const hourlySlots = await hourlyRepository.createHourlySlots(schedule.id, schedule.initialTime, schedule.endTime, schedule.interval);
        await schedulingRepository.create({
            professionalPersonId: professional.person_id,
            userPersonId: user.person_id,
            hourlyId: hourlySlots[1].id,
        });
        const { schedulingDetails } = await sut.execute({
            userId: user.person_id,
        });
        (0, vitest_1.expect)(schedulingDetails.nameProfessional).toEqual('Dr. Maria Silva Santos');
        (0, vitest_1.expect)(schedulingDetails.hour).toEqual('10:00');
    });
});
