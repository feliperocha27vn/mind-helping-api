"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_not_valid_1 = require("@/errors/date-not-valid");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_professional_repository_1 = require("@/in-memory-repository/in-memory-professional-repository");
const in_memory_scheduling_repository_1 = require("@/in-memory-repository/in-memory-scheduling-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const get_schedulings_by_date_1 = require("./get-schedulings-by-date");
let personRepository;
let professionalRepository;
let schedulingRepository;
let sut;
(0, vitest_1.describe)('Get schedulings by date use case', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        schedulingRepository = new in_memory_scheduling_repository_1.InMemorySchedulingRepository();
        sut = new get_schedulings_by_date_1.GetSchedulingsByDateUseCase(schedulingRepository, professionalRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('should be able to get schedulings count by date', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-06-10T10:00:00'));
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Dr. João Silva',
            birth_date: '1980-05-20',
            cpf: '987.654.321-00',
            address: 'Av. Principal',
            neighborhood: 'Centro',
            number: 500,
            complement: 'Consultório 301',
            cep: '12345-678',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 98888-7777',
            email: 'dr.joao@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const professional = await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: false,
        });
        // Criar alguns agendamentos na data específica
        await schedulingRepository.create({
            hourlyId: 'hourly-01',
            professionalPersonId: professional.person_id,
            userPersonId: 'user-01',
        });
        await schedulingRepository.create({
            hourlyId: 'hourly-02',
            professionalPersonId: professional.person_id,
            userPersonId: 'user-02',
        });
        const { schedulingsCount } = await sut.execute({
            professionalId: professional.person_id,
            startDay: new Date('2024-06-10'),
            endDay: new Date('2024-06-10'),
        });
        (0, vitest_1.expect)(schedulingsCount).toBe(2);
    });
    (0, vitest_1.it)('should return null when no schedulings found in date range', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-06-10T10:00:00'));
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Dr. João Silva',
            birth_date: '1980-05-20',
            cpf: '987.654.321-00',
            address: 'Av. Principal',
            neighborhood: 'Centro',
            number: 500,
            complement: 'Consultório 301',
            cep: '12345-678',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 98888-7777',
            email: 'dr.joao@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const professional = await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: false,
        });
        const { schedulingsCount } = await sut.execute({
            professionalId: professional.person_id,
            startDay: new Date('2024-07-01'),
            endDay: new Date('2024-07-31'),
        });
        (0, vitest_1.expect)(schedulingsCount).toBeNull();
    });
    (0, vitest_1.it)('should not be able to get schedulings with invalid professionalId', async () => {
        await (0, vitest_1.expect)(() => sut.execute({
            professionalId: 'invalid-professional-id',
            startDay: new Date('2024-06-10'),
            endDay: new Date('2024-06-10'),
        })).rejects.toThrowError('Person not found');
    });
    (0, vitest_1.it)('should not be able to get schedulings with invalid start date', async () => {
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Dr. João Silva',
            birth_date: '1980-05-20',
            cpf: '987.654.321-00',
            address: 'Av. Principal',
            neighborhood: 'Centro',
            number: 500,
            complement: 'Consultório 301',
            cep: '12345-678',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 98888-7777',
            email: 'dr.joao@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const professional = await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: false,
        });
        await (0, vitest_1.expect)(() => sut.execute({
            professionalId: professional.person_id,
            startDay: new Date('invalid-date'),
            endDay: new Date('2024-06-10'),
        })).rejects.toThrowError(date_not_valid_1.DateNotValidError);
    });
    (0, vitest_1.it)('should not be able to get schedulings with invalid end date', async () => {
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Dr. João Silva',
            birth_date: '1980-05-20',
            cpf: '987.654.321-00',
            address: 'Av. Principal',
            neighborhood: 'Centro',
            number: 500,
            complement: 'Consultório 301',
            cep: '12345-678',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 98888-7777',
            email: 'dr.joao@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const professional = await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: false,
        });
        await (0, vitest_1.expect)(() => sut.execute({
            professionalId: professional.person_id,
            startDay: new Date('2024-06-10'),
            endDay: new Date('invalid-date'),
        })).rejects.toThrowError(date_not_valid_1.DateNotValidError);
    });
    (0, vitest_1.it)('should be able to get schedulings in a date range', async () => {
        vitest_1.vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Dr. João Silva',
            birth_date: '1980-05-20',
            cpf: '987.654.321-00',
            address: 'Av. Principal',
            neighborhood: 'Centro',
            number: 500,
            complement: 'Consultório 301',
            cep: '12345-678',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 98888-7777',
            email: 'dr.joao@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const professional = await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: false,
        });
        // Criar agendamentos em datas diferentes dentro do range
        await schedulingRepository.create({
            hourlyId: 'hourly-01',
            professionalPersonId: professional.person_id,
            userPersonId: 'user-01',
        });
        vitest_1.vi.setSystemTime(new Date('2024-06-20T14:00:00'));
        await schedulingRepository.create({
            hourlyId: 'hourly-02',
            professionalPersonId: professional.person_id,
            userPersonId: 'user-02',
        });
        const { schedulingsCount } = await sut.execute({
            professionalId: professional.person_id,
            startDay: new Date('2024-06-01'),
            endDay: new Date('2024-06-30'),
        });
        (0, vitest_1.expect)(schedulingsCount).toBe(2);
    });
});
