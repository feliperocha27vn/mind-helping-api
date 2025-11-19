import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPatientsUseCase } from './fetch-patients-use-case'

let personRepository: InMemoryPersonRepository
let professionalRepository: InMemoryProfessionalRepository
let schedulingRepository: InMemorySchedulingRepository
let sut: FetchPatientsUseCase

describe('Fetch Patients Use Case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    schedulingRepository = new InMemorySchedulingRepository()
    sut = new FetchPatientsUseCase(
      professionalRepository,
      schedulingRepository,
      personRepository
    )
  })

  it('should be able to fetch patients by professional id', async () => {
    const professionalPerson = await personRepository.create({
      name: 'Dr. João Silva',
      birth_date: '1980-05-20',
      cpf: '123.456.789-00',
      address: 'Rua dos Psicólogos',
      neighborhood: 'Centro',
      number: 100,
      complement: 'Sala 101',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98765-4321',
      email: 'joao@email.com',
      password_hash: await hash('senha123', 6),
    })

    await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '12345/SP',
      voluntary: false,
    })

    const patient1 = await personRepository.create({
      name: 'Maria Santos',
      birth_date: '1995-03-15',
      cpf: '987.654.321-00',
      address: 'Rua das Flores',
      neighborhood: 'Vila Nova',
      number: 50,
      complement: 'Apt 10',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-1111',
      email: 'maria@email.com',
      password_hash: await hash('senha123', 6),
    })

    const patient2 = await personRepository.create({
      name: 'Pedro Oliveira',
      birth_date: '1992-07-22',
      cpf: '456.789.123-00',
      address: 'Avenida Paulista',
      neighborhood: 'Bela Vista',
      number: 1000,
      complement: 'Apt 505',
      cep: '01311-100',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98888-2222',
      email: 'pedro@email.com',
      password_hash: await hash('senha123', 6),
    })

    await schedulingRepository.create({
      professionalPersonId: professionalPerson.id,
      userPersonId: patient1.id,
      hourlyId: 'hourly-01',
      isCanceled: false,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professionalPerson.id,
      userPersonId: patient2.id,
      hourlyId: 'hourly-02',
      isCanceled: false,
      onFinishedConsultation: true,
    })

    const result = await sut.execute({
      professionalId: professionalPerson.id,
      page: 1,
    })

    expect(result.patients).toHaveLength(2)
    expect(result.patients[0]).toEqual(
      expect.objectContaining({
        patientId: patient1.id,
        patientName: 'Maria Santos',
        patientAge: expect.any(Number),
      })
    )
    expect(result.patients[1]).toEqual(
      expect.objectContaining({
        patientId: patient2.id,
        patientName: 'Pedro Oliveira',
        patientAge: expect.any(Number),
      })
    )
  })

  it('should calculate patient age correctly', async () => {
    const professionalPerson = await personRepository.create({
      name: 'Dr. Ana Costa',
      birth_date: '1980-05-20',
      cpf: '111.222.333-00',
      address: 'Rua dos Psicólogos',
      neighborhood: 'Centro',
      number: 100,
      complement: 'Sala 101',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98765-4321',
      email: 'ana@email.com',
      password_hash: await hash('senha123', 6),
    })

    await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '54321/SP',
      voluntary: false,
    })

    const today = new Date()
    const birthYear = today.getFullYear() - 30
    const birthDate = new Date(birthYear, today.getMonth(), today.getDate())
    const patient = await personRepository.create({
      name: 'João Paciente',
      birth_date: birthDate.toISOString().split('T')[0],
      cpf: '222.333.444-00',
      address: 'Rua Test',
      neighborhood: 'Test',
      number: 1,
      complement: 'Test',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      password_hash: await hash('senha123', 6),
    })

    await schedulingRepository.create({
      professionalPersonId: professionalPerson.id,
      userPersonId: patient.id,
      hourlyId: 'hourly-03',
      isCanceled: false,
      onFinishedConsultation: true,
    })

    const result = await sut.execute({
      professionalId: professionalPerson.id,
      page: 1,
    })

    expect(result.patients[0].patientAge).toBe(30)
  })

  it('should throw PersonNotFoundError when professional does not exist', async () => {
    await expect(() =>
      sut.execute({
        professionalId: 'non-existing-professional-id',
        page: 1,
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })

  it('should throw PersonNotFoundError when patient data is not found', async () => {
    const professionalPerson = await personRepository.create({
      name: 'Dr. Carlos Silva',
      birth_date: '1980-05-20',
      cpf: '333.444.555-00',
      address: 'Rua dos Psicólogos',
      neighborhood: 'Centro',
      number: 100,
      complement: 'Sala 101',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98765-4321',
      email: 'carlos@email.com',
      password_hash: await hash('senha123', 6),
    })

    await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '99999/SP',
      voluntary: false,
    })

    const nonExistingPatientId = 'non-existing-patient-id'
    await schedulingRepository.create({
      professionalPersonId: professionalPerson.id,
      userPersonId: nonExistingPatientId,
      hourlyId: 'hourly-04',
      isCanceled: false,
      onFinishedConsultation: true,
    })

    await expect(() =>
      sut.execute({
        professionalId: professionalPerson.id,
        page: 1,
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })

  it('should return empty array when professional has no patients', async () => {
    const professionalPerson = await personRepository.create({
      name: 'Dr. Lucia Ferreira',
      birth_date: '1980-05-20',
      cpf: '555.666.777-00',
      address: 'Rua dos Psicólogos',
      neighborhood: 'Centro',
      number: 100,
      complement: 'Sala 101',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98765-4321',
      email: 'lucia@email.com',
      password_hash: await hash('senha123', 6),
    })

    await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '77777/SP',
      voluntary: false,
    })

    const result = await sut.execute({
      professionalId: professionalPerson.id,
      page: 1,
    })

    expect(result.patients).toHaveLength(0)
  })

  it('should handle pagination correctly', async () => {
    const professionalPerson = await personRepository.create({
      name: 'Dr. Roberto Costa',
      birth_date: '1980-05-20',
      cpf: '666.777.888-00',
      address: 'Rua dos Psicólogos',
      neighborhood: 'Centro',
      number: 100,
      complement: 'Sala 101',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98765-4321',
      email: 'roberto@email.com',
      password_hash: await hash('senha123', 6),
    })

    await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '88888/SP',
      voluntary: false,
    })

    const patients = []
    for (let i = 0; i < 15; i++) {
      const patient = await personRepository.create({
        name: `Patient ${i + 1}`,
        birth_date: '1995-03-15',
        cpf: `${i}11.111.111-00`,
        address: 'Rua Test',
        neighborhood: 'Test',
        number: i,
        complement: 'Test',
        cep: '01234-567',
        city: 'São Paulo',
        uf: 'SP',
        phone: '(11) 99999-9999',
        email: `patient${i}@email.com`,
        password_hash: await hash('senha123', 6),
      })

      patients.push(patient)

      await schedulingRepository.create({
        professionalPersonId: professionalPerson.id,
        userPersonId: patient.id,
        hourlyId: `hourly-${i}`,
        isCanceled: false,
        onFinishedConsultation: true,
      })
    }

    const resultPage1 = await sut.execute({
      professionalId: professionalPerson.id,
      page: 1,
    })

    expect(resultPage1.patients).toHaveLength(10)

    const resultPage2 = await sut.execute({
      professionalId: professionalPerson.id,
      page: 2,
    })

    expect(resultPage2.patients).toHaveLength(5)
  })

  it('should return patients ordered by scheduling', async () => {
    const professionalPerson = await personRepository.create({
      name: 'Dr. Patricia Lima',
      birth_date: '1980-05-20',
      cpf: '777.888.999-00',
      address: 'Rua dos Psicólogos',
      neighborhood: 'Centro',
      number: 100,
      complement: 'Sala 101',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98765-4321',
      email: 'patricia@email.com',
      password_hash: await hash('senha123', 6),
    })

    await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '11111/SP',
      voluntary: false,
    })

    const patient1 = await personRepository.create({
      name: 'First Patient',
      birth_date: '1990-03-15',
      cpf: '111.111.111-11',
      address: 'Rua Test',
      neighborhood: 'Test',
      number: 1,
      complement: 'Test',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-9999',
      email: 'first@email.com',
      password_hash: await hash('senha123', 6),
    })

    const patient2 = await personRepository.create({
      name: 'Second Patient',
      birth_date: '1992-07-20',
      cpf: '222.222.222-22',
      address: 'Rua Test',
      neighborhood: 'Test',
      number: 2,
      complement: 'Test',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-9999',
      email: 'second@email.com',
      password_hash: await hash('senha123', 6),
    })

    await schedulingRepository.create({
      professionalPersonId: professionalPerson.id,
      userPersonId: patient1.id,
      hourlyId: 'hourly-1',
      isCanceled: false,
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      professionalPersonId: professionalPerson.id,
      userPersonId: patient2.id,
      hourlyId: 'hourly-2',
      isCanceled: false,
      onFinishedConsultation: true,
    })

    const result = await sut.execute({
      professionalId: professionalPerson.id,
      page: 1,
    })

    expect(result.patients[0].patientName).toBe('First Patient')
    expect(result.patients[1].patientName).toBe('Second Patient')
  })
})
