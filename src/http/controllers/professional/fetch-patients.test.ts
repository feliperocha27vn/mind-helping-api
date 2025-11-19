import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import { createUser } from '@/utils/tests/create-user'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Fetch Patients by Professional', () => {
  it('should be able to fetch patients by professional id', async () => {
    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user: patient1 } = await createUser()
    const { user: patient2 } = await createUser()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)

    const initialTime = new Date(futureDate)
    initialTime.setUTCHours(9, 0, 0, 0)

    const endTime = new Date(futureDate)
    endTime.setUTCHours(18, 0, 0, 0)

    const { hourlies } = await createHourlies(
      schedule.id,
      initialTime,
      endTime,
      schedule.interval ?? 0
    )

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: patient1.person_id,
        hourlyId: hourlies[0].id,
        onFinishedConsultation: true,
      },
    })

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: patient2.person_id,
        hourlyId: hourlies[1].id,
        onFinishedConsultation: true,
      },
    })

    const reply = await request(app.server)
      .get(`/professionals/patients/${professional.person_id}`)
      .query({ page: 1 })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.patients).toBeInstanceOf(Array)
    expect(reply.body.patients).toHaveLength(2)
    expect(reply.body.patients[0]).toHaveProperty('patientId')
    expect(reply.body.patients[0]).toHaveProperty('patientName')
    expect(reply.body.patients[0]).toHaveProperty('patientAge')
  })

  it('should return 404 when professional does not exist', async () => {
    const nonExistentProfessionalId = '550e8400-e29b-41d4-a716-446655440000'

    const reply = await request(app.server)
      .get(`/professionals/patients/${nonExistentProfessionalId}`)
      .query({ page: 1 })

    expect(reply.statusCode).toEqual(404)
    expect(reply.body).toHaveProperty('message')
  })

  it('should return empty array when professional has no patients', async () => {
    const { professional } = await createProfessionalAndSchedule()

    const reply = await request(app.server)
      .get(`/professionals/patients/${professional.person_id}`)
      .query({ page: 1 })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.patients).toBeInstanceOf(Array)
    expect(reply.body.patients).toHaveLength(0)
  })

  it('should not return duplicate patients when they have multiple finished consultations', async () => {
    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user: patient } = await createUser()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)

    const initialTime = new Date(futureDate)
    initialTime.setUTCHours(9, 0, 0, 0)

    const endTime = new Date(futureDate)
    endTime.setUTCHours(18, 0, 0, 0)

    const { hourlies } = await createHourlies(
      schedule.id,
      initialTime,
      endTime,
      schedule.interval ?? 0
    )

    // Create multiple finished consultations for the same patient
    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: patient.person_id,
        hourlyId: hourlies[0].id,
        onFinishedConsultation: true,
      },
    })

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: patient.person_id,
        hourlyId: hourlies[1].id,
        onFinishedConsultation: true,
      },
    })

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: patient.person_id,
        hourlyId: hourlies[2].id,
        onFinishedConsultation: true,
      },
    })

    const reply = await request(app.server)
      .get(`/professionals/patients/${professional.person_id}`)
      .query({ page: 1 })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.patients).toBeInstanceOf(Array)
    expect(reply.body.patients).toHaveLength(1)
    expect(reply.body.patients[0].patientId).toEqual(patient.person_id)
  })
})
