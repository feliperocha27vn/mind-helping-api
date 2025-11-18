import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeleteScheduleUseCase } from './delete'

let personRepository: InMemoryPersonRepository
let professionalRepository: InMemoryProfessionalRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: DeleteScheduleUseCase

describe('Delete schedule use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    sut = new DeleteScheduleUseCase(scheduleRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to delete a schedule', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

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

    const professional = await professionalRepository.create({
      crp: '06/12345',
      person_id: person.id,
      voluntary: false,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00'),
      endTime: new Date('2024-12-31T18:00:00'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento presencial',
    })

    await sut.execute({
      scheduleId: schedule.id,
    })

    const deletedSchedule = await scheduleRepository.getById(schedule.id)

    expect(deletedSchedule).toBeNull()
  })

  it('should not be able to delete a non-existing schedule', async () => {
    await expect(() =>
      sut.execute({
        scheduleId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
