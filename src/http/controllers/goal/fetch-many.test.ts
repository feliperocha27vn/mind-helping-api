import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createGoalWithPrisma } from '@/utils/tests/create-goal'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Fetch goals', () => {
  it('should be able to fetch goals for a user', async () => {
    const { user } = await createGoalWithPrisma()

    await prisma.goal.createMany({
      data: [
        {
          userPersonId: user.person_id,
          description: 'New Goal',
          numberDays: 5,
        },
        {
          userPersonId: user.person_id,
          description: 'New Goal 2',
          numberDays: 10,
        },
      ],
    })

    const reply = await request(app.server).get(`/goals/${user.person_id}`)
    expect(reply.statusCode).toEqual(200)

    const goals = await prisma.goal.findMany({
      where: { userPersonId: user.person_id },
    })

    expect(goals.length).toEqual(3)
  })
})
