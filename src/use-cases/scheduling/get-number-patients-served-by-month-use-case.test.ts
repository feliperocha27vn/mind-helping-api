import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import { GetNumberPatientsServedUseCase } from './get-number-patients-served-by-month-use-case'

let userRepository: InMemoryUserRepository
let professionalRepository: InMemoryProfessionalRepository
let hourlyRepository: InMemoryHourlyRepository
let personRepository: InMemoryPersonRepository
let schedulingRepository: InMemorySchedulingRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: GetNumberPatientsServedUseCase

describe('Get number of patients served by month use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    userRepository = new InMemoryUserRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    hourlyRepository = new InMemoryHourlyRepository()
    schedulingRepository = new InMemorySchedulingRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    sut = new GetNumberPatientsServedUseCase(
      schedulingRepository,
      professionalRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get number of patients served by month', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

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
      password_hash: await hash('senha123', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '123456789',
      voluntary: false,
    })

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
      password_hash: await hash('senha123', 6),
    })

    const user = await userRepository.create({
      gender: 'female',
      person_id: userPerson.id,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00.000Z'),
      endTime: new Date('2024-12-31T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento presencial',
    })

    const hourlySlots = await hourlyRepository.createHourlySlots(
      schedule.id,
      schedule.initialTime,
      schedule.endTime,
      schedule.interval
    )

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[1].id,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[2].id,
      onFinishedConsultation: true,
    })

    const { numberPatientsServedByMonth } = await sut.execute({
      professionalId: professional.person_id,
      month: 11,
    })

    expect(numberPatientsServedByMonth).toBe(2)
  })

  it('should return zero when professional has no patients served in the month', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-01',
      name: 'Dr. João Oliveira',
      birth_date: '1980-05-20',
      cpf: '987.654.321-00',
      address: 'Av. Paulista',
      neighborhood: 'Bela Vista',
      number: 1000,
      complement: 'Andar 10',
      cep: '01310-100',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98888-7777',
      email: 'joao.oliveira@email.com',
      password_hash: await hash('senha456', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '987654321',
      voluntary: true,
    })

    const { numberPatientsServedByMonth } = await sut.execute({
      professionalId: professional.person_id,
      month: 11,
    })

    expect(numberPatientsServedByMonth).toBe(0)
  })

  it('should not be able to get number of patients served with invalid professional id', async () => {
    await expect(() =>
      sut.execute({
        professionalId: 'non-existent-professional-id',
        month: 11,
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })

  it('should return correct count for different months', async () => {
    const professionalPerson = await personRepository.create({
      id: 'person-01',
      name: 'Dr. Carlos Alberto',
      birth_date: '1975-08-10',
      cpf: '111.222.333-44',
      address: 'Rua Augusta',
      neighborhood: 'Consolação',
      number: 500,
      complement: 'Conjunto 5',
      cep: '01305-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 97777-6666',
      email: 'carlos.alberto@email.com',
      password_hash: await hash('senha789', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '111222333',
      voluntary: false,
    })

    const userPerson1 = await personRepository.create({
      id: 'person-02',
      name: 'Paciente Um',
      birth_date: '1990-01-01',
      cpf: '222.333.444-55',
      address: 'Rua A',
      neighborhood: 'Bairro A',
      number: 100,
      complement: 'Apto 1',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 96666-5555',
      email: 'paciente1@email.com',
      password_hash: await hash('senha123', 6),
    })

    const user1 = await userRepository.create({
      gender: 'male',
      person_id: userPerson1.id,
    })

    const userPerson2 = await personRepository.create({
      id: 'person-03',
      name: 'Paciente Dois',
      birth_date: '1992-02-02',
      cpf: '333.444.555-66',
      address: 'Rua B',
      neighborhood: 'Bairro B',
      number: 200,
      complement: 'Apto 2',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 95555-4444',
      email: 'paciente2@email.com',
      password_hash: await hash('senha456', 6),
    })

    const user2 = await userRepository.create({
      gender: 'female',
      person_id: userPerson2.id,
    })

    // Criar agendamentos para janeiro (mês 0)
    vi.setSystemTime(new Date('2024-01-15T10:00:00'))

    const schedule1 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-01-15T09:00:00.000Z'),
      endTime: new Date('2024-01-15T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento janeiro',
    })

    const hourlySlots1 = await hourlyRepository.createHourlySlots(
      schedule1.id,
      schedule1.initialTime,
      schedule1.endTime,
      schedule1.interval
    )

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user1.person_id,
      hourlyId: hourlySlots1[0].id,
      onFinishedConsultation: true,
    })

    // Criar agendamentos para maio (mês 4)
    vi.setSystemTime(new Date('2024-05-20T10:00:00'))

    const schedule2 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-05-20T09:00:00.000Z'),
      endTime: new Date('2024-05-20T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento maio',
    })

    const hourlySlots2 = await hourlyRepository.createHourlySlots(
      schedule2.id,
      schedule2.initialTime,
      schedule2.endTime,
      schedule2.interval
    )

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user1.person_id,
      hourlyId: hourlySlots2[0].id,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user2.person_id,
      hourlyId: hourlySlots2[1].id,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user1.person_id,
      hourlyId: hourlySlots2[2].id,
      onFinishedConsultation: true,
    })

    // Verificar janeiro (mês 0)
    const resultJanuary = await sut.execute({
      professionalId: professional.person_id,
      month: 0,
    })
    expect(resultJanuary.numberPatientsServedByMonth).toBe(1)

    // Verificar maio (mês 4)
    const resultMay = await sut.execute({
      professionalId: professional.person_id,
      month: 4,
    })
    expect(resultMay.numberPatientsServedByMonth).toBe(3)

    // Verificar um mês sem atendimentos (mês 2 - março)
    const resultMarch = await sut.execute({
      professionalId: professional.person_id,
      month: 2,
    })
    expect(resultMarch.numberPatientsServedByMonth).toBe(0)
  })

  it('should only count consultations that are finished (onFinishedConsultation = true)', async () => {
    vi.setSystemTime(new Date('2024-08-01T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-01',
      name: 'Dr. Ana Paula',
      birth_date: '1988-12-05',
      cpf: '444.555.666-77',
      address: 'Rua Oscar Freire',
      neighborhood: 'Jardins',
      number: 300,
      cep: '01426-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 94444-3333',
      email: 'ana.paula@email.com',
      complement: 'Conjunto 1',
      password_hash: await hash('senha999', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '444555666',
      voluntary: false,
    })

    const userPerson = await personRepository.create({
      id: 'person-02',
      name: 'Paciente Teste',
      birth_date: '1995-03-15',
      cpf: '555.666.777-88',
      address: 'Rua C',
      neighborhood: 'Bairro C',
      number: 300,
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 93333-2222',
      complement: 'Conjunto 2',
      email: 'paciente.teste@email.com',
      password_hash: await hash('senha321', 6),
    })

    const user = await userRepository.create({
      gender: 'male',
      person_id: userPerson.id,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 200,
      cancellationPolicy: 48,
      initialTime: new Date('2024-08-10T09:00:00.000Z'),
      endTime: new Date('2024-08-10T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento agosto',
    })

    const hourlySlots = await hourlyRepository.createHourlySlots(
      schedule.id,
      schedule.initialTime,
      schedule.endTime,
      schedule.interval
    )

    // Criar 3 agendamentos finalizados
    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[0].id,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[1].id,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[2].id,
      onFinishedConsultation: true,
    })

    // Criar 2 agendamentos não finalizados
    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[3].id,
      onFinishedConsultation: false,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[4].id,
      onFinishedConsultation: false,
    })

    const { numberPatientsServedByMonth } = await sut.execute({
      professionalId: professional.person_id,
      month: 7, // agosto (mês 7)
    })

    // Deve contar apenas os 3 agendamentos finalizados
    expect(numberPatientsServedByMonth).toBe(3)
  })

  it('should return zero for future months with no schedulings', async () => {
    vi.setSystemTime(new Date('2024-03-01T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-01',
      name: 'Dr. Roberto Lima',
      birth_date: '1970-07-25',
      cpf: '666.777.888-99',
      address: 'Av. Brigadeiro Faria Lima',
      neighborhood: 'Itaim Bibi',
      number: 2000,
      cep: '01451-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 92222-1111',
      complement: 'Conjunto 1',
      email: 'roberto.lima@email.com',
      password_hash: await hash('senha555', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '666777888',
      voluntary: true,
    })

    // Verificar dezembro (mês 11) sem agendamentos
    const { numberPatientsServedByMonth } = await sut.execute({
      professionalId: professional.person_id,
      month: 11,
    })

    expect(numberPatientsServedByMonth).toBe(0)
  })

  it('should handle January (month 0) correctly', async () => {
    vi.setSystemTime(new Date('2024-01-15T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-01',
      name: 'Dr. Fernanda Costa',
      birth_date: '1983-04-18',
      cpf: '777.888.999-00',
      address: 'Rua Haddock Lobo',
      neighborhood: 'Cerqueira César',
      number: 800,
      cep: '01414-001',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 91111-0000',
      email: 'fernanda.costa@email.com',
      complement: 'Conjunto 1',
      password_hash: await hash('senha777', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '777888999',
      voluntary: false,
    })

    const userPerson = await personRepository.create({
      id: 'person-02',
      name: 'Paciente Janeiro',
      birth_date: '1993-06-20',
      cpf: '888.999.000-11',
      address: 'Rua D',
      neighborhood: 'Bairro D',
      number: 400,
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 90000-9999',
      email: 'paciente.janeiro@email.com',
      complement: 'Conjunto 1',
      password_hash: await hash('senha888', 6),
    })

    const user = await userRepository.create({
      gender: 'female',
      person_id: userPerson.id,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 180,
      cancellationPolicy: 24,
      initialTime: new Date('2024-01-20T09:00:00.000Z'),
      endTime: new Date('2024-01-20T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento janeiro',
    })

    const hourlySlots = await hourlyRepository.createHourlySlots(
      schedule.id,
      schedule.initialTime,
      schedule.endTime,
      schedule.interval
    )

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[0].id,
      onFinishedConsultation: true,
    })

    const { numberPatientsServedByMonth } = await sut.execute({
      professionalId: professional.person_id,
      month: 0, // Janeiro
    })

    expect(numberPatientsServedByMonth).toBe(1)
  })

  it('should handle December (month 11) correctly', async () => {
    vi.setSystemTime(new Date('2024-12-15T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-01',
      name: 'Dr. Pedro Henrique',
      birth_date: '1979-09-30',
      cpf: '999.000.111-22',
      address: 'Rua da Consolação',
      neighborhood: 'Consolação',
      number: 1500,
      cep: '01301-100',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98888-7777',
      email: 'pedro.henrique@email.com',
      complement: 'Conjunto 1',
      password_hash: await hash('senha000', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '999000111',
      voluntary: false,
    })

    const userPerson = await personRepository.create({
      id: 'person-02',
      name: 'Paciente Dezembro',
      birth_date: '1991-11-11',
      cpf: '000.111.222-33',
      address: 'Rua E',
      neighborhood: 'Bairro E',
      number: 500,
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 97777-6666',
      email: 'paciente.dezembro@email.com',
      complement: 'Conjunto 1',
      password_hash: await hash('senha111', 6),
    })

    const user = await userRepository.create({
      gender: 'male',
      person_id: userPerson.id,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 220,
      cancellationPolicy: 48,
      initialTime: new Date('2024-12-25T09:00:00.000Z'),
      endTime: new Date('2024-12-25T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento dezembro',
    })

    const hourlySlots = await hourlyRepository.createHourlySlots(
      schedule.id,
      schedule.initialTime,
      schedule.endTime,
      schedule.interval
    )

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[0].id,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[1].id,
      onFinishedConsultation: true,
    })

    const { numberPatientsServedByMonth } = await sut.execute({
      professionalId: professional.person_id,
      month: 11, // Dezembro
    })

    expect(numberPatientsServedByMonth).toBe(2)
  })
})
