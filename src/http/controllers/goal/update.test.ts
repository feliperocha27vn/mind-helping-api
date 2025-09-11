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

describe('Update goal', () => {
  it('should be able to update a goal', async () => {
    const { goal, user } = await createGoalWithPrisma()

    const reply = await request(app.server)
      .patch(`/goal/update/${goal.id}/${user.person_id}`)
      .send({
        description: 'Updated description',
        numberDays: 5,
      })

    expect(reply.statusCode).toEqual(200)

    const getUpdatedGoal = await prisma.goal.findUniqueOrThrow({
      where: { id: goal.id },
    })

    expect(getUpdatedGoal.description).toEqual('Updated description')
  })
})
