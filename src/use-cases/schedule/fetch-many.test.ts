import { NotExistingSchedulesError } from '@/errors/not-existing-schedules'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchManySchedulesUseCase } from './fetch-many'

let personRepository: InMemoryPersonRepository
let professionalRepository: InMemoryProfessionalRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: FetchManySchedulesUseCase

describe('Fetch schedules use case', () => {
  beforeEach(() => {
    scheduleRepository = new InMemoryScheduleRepository()
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    sut = new FetchManySchedulesUseCase(
      scheduleRepository,
      professionalRepository
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch schedules', async () => {
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
      password_hash: await hash('senha123', 6),
    })

    const professinal = await professionalRepository.create({
      crp: '06/12345',
      person_id: person.id,
      voluntary: false,
    })

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
    })

    const { schedules } = await sut.execute({
      professionalId: professinal.person_id,
    })

    expect(schedules).toHaveLength(1)
  })

  it('should not be able to fetch schedules, if professional does not exist', async () => {
    expect(() =>
      sut.execute({
        professionalId: 'non-existing-professional-id',
      })
    ).rejects.toThrow(PersonNotFoundError)
  })

  it('should not be able to fetch schedules, if schedule does not exist', async () => {
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
      password_hash: await hash('senha123', 6),
    })

    const professinal = await professionalRepository.create({
      crp: '06/12345',
      person_id: person.id,
      voluntary: false,
    })

    expect(() =>
      sut.execute({
        professionalId: professinal.person_id,
      })
    ).rejects.toThrow(NotExistingSchedulesError)
  })
})
