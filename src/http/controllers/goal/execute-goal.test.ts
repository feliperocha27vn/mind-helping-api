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

describe('Execute goal', () => {
  it('should be able to execute a goal', async () => {
    const { goal, user } = await createGoalWithPrisma()

    const reply = await request(app.server).patch(
      `/goal/execute/${goal.id}/${user.person_id}`
    )
    expect(reply.statusCode).toEqual(200)

    const isUpdatedGoal = await prisma.goal.findUniqueOrThrow({
      where: { id: goal.id },
    })

    expect(isUpdatedGoal.isExecuted).toBe(true)
  })
})
