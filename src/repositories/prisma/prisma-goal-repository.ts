import { prisma } from '@/lib/prisma'
import type { Goal, Prisma } from '@prisma/client'
import type { GoalRepository } from '../goal-repository'

export class PrismaGoalRepository implements GoalRepository {
  async create(data: Prisma.GoalUncheckedCreateInput) {
    const goal = await prisma.goal.create({
      data,
    })

    return goal
  }

  async findById(goalId: string): Promise<Goal | null> {
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
      },
    })

    return goal
  }

  async delete(goalId: string, personId: string) {
    await prisma.goal.deleteMany({
      where: {
        id: goalId,
        userPersonId: personId,
      },
    })
  }

  async fetchManyGoals(personId: string) {
    const goals = await prisma.goal.findMany({
      where: {
        userPersonId: personId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return goals
  }

  async update(
    goalId: string,
    personId: string,
    goal: Prisma.GoalUncheckedUpdateInput
  ) {
    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId,
      },
      data: goal,
    })

    return updatedGoal
  }

  async updateExecuteGoal(goalId: string, personId: string) {
    await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId,
      },
      data: {
        isExecuted: true,
      },
    })
  }

  async updateInactivateOldGoal(goalId: string, personId: string) {
    await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId,
      },
      data: {
        isExpire: true,
      },
    })
  }

  async addCounter(goalId: string, personId: string) {
    const goal = await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId,
      },
      data: {
        counter: {
          increment: 1,
        },
      },
    })

    return goal
  }

  async getCountExecutedGoals(personId: string) {
    const countedExecutedGoals = await prisma.goal.count({
      where: {
        userPersonId: personId,
        isExecuted: true,
      },
    })

    return countedExecutedGoals
  }
}
