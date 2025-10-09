import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUser } from '@/utils/tests/create-user'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

afterEach(async () => {
  await prisma.feelingsUser.deleteMany()
  await prisma.user.deleteMany()
  await prisma.person.deleteMany()
})

describe('Get feelings by date user', () => {
  it('should be able to get the user feelings by date', async () => {
    const { user } = await createUser()

    await prisma.feelingsUser.createMany({
      data: [
        {
          description: 'FELIZ',
          motive: 'Hoje é um ótimo dia!',
          userPersonId: user.person_id,
          createdAt: new Date('2023-07-20T14:00:00Z'),
          updatedAt: new Date('2023-07-20T14:00:00Z'),
        },
        {
          description: 'ANSIOSO',
          motive: 'Hoje estou me sentindo ansioso!',
          userPersonId: user.person_id,
          createdAt: new Date('2023-07-20T16:00:00Z'),
          updatedAt: new Date('2023-07-20T16:00:00Z'),
        },
        {
          description: 'RAIVA',
          motive: 'Hoje estou me sentindo raivoso!',
          userPersonId: user.person_id,
          updatedAt: new Date('2023-07-20T19:00:00Z'),
          createdAt: new Date('2023-07-20T19:00:00Z'),
        },
      ],
    })

    const reply = await request(app.server).get(
      `/feelings/${user.person_id}?startDay=2023-07-20&endDay=2023-07-20`
    )

    expect(reply.status).toBe(200)
    expect(reply.body.feelings).toHaveLength(3)
    expect(reply.body.feelings[0].description).toBe('FELIZ')
    expect(reply.body.feelings[1].description).toBe('ANSIOSO')
    expect(reply.body.feelings[2].description).toBe('RAIVA')
  })

  it('should be able to get the user feelings by date range', async () => {
    const { user } = await createUser()

    await prisma.feelingsUser.createMany({
      data: [
        {
          description: 'FELIZ',
          motive: 'Primeiro dia!',
          userPersonId: user.person_id,
          createdAt: new Date('2023-07-20T14:00:00Z'),
          updatedAt: new Date('2023-07-20T14:00:00Z'),
        },
        {
          description: 'ANSIOSO',
          motive: 'Segundo dia!',
          userPersonId: user.person_id,
          createdAt: new Date('2023-07-21T16:00:00Z'),
          updatedAt: new Date('2023-07-21T16:00:00Z'),
        },
        {
          description: 'RAIVA',
          motive: 'Terceiro dia!',
          userPersonId: user.person_id,
          createdAt: new Date('2023-07-22T19:00:00Z'),
          updatedAt: new Date('2023-07-22T19:00:00Z'),
        },
        {
          description: 'TEDIO',
          motive: 'Fora do intervalo!',
          userPersonId: user.person_id,
          createdAt: new Date('2023-07-25T19:00:00Z'),
          updatedAt: new Date('2023-07-25T19:00:00Z'),
        },
      ],
    })

    const reply = await request(app.server).get(
      `/feelings/${user.person_id}?startDay=2023-07-20&endDay=2023-07-22`
    )

    expect(reply.status).toBe(200)
    expect(reply.body.feelings).toHaveLength(3)
    expect(reply.body.feelings[0].description).toBe('FELIZ')
    expect(reply.body.feelings[1].description).toBe('ANSIOSO')
    expect(reply.body.feelings[2].description).toBe('RAIVA')
  })
})
