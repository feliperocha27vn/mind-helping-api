import type { GoalRepository } from '@/repositories/goal-repository'
import type { Goal, Prisma } from '@prisma/client'

export class InMemoryGoalRepository implements GoalRepository {
  private goals: Goal[] = []

  async create(data: Prisma.GoalUncheckedCreateInput) {
    const goal = {
      id: data.id ?? crypto.randomUUID(),
      userPersonId: data.userPersonId,
      description: data.description,
      numberDays: data.numberDays,
      isExecuted: data.isExecuted ?? false,
      isExpire: data.isExpire ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.goals.push(goal)

    return goal
  }

  async findById(id: string) {
    const goal = this.goals.find(goal => goal.id === id)

    if (!goal) {
      return null
    }

    return goal
  }

  async updateInactivateOldGoal(goalId: string, personId: string) {
    const person = this.goals.find(goal => goal.userPersonId === personId)

    if (!person) {
      return null
    }

    const goal = await this.findById(goalId)

    if (!goal) {
      return null
    }

    goal.isExpire = true

    return goal
  }

  async updateExecuteGoal(goalId: string, personId: string) {
    const person = this.goals.find(goal => goal.userPersonId === personId)

    if (!person) {
      return null
    }

    const goal = await this.findById(goalId)

    if (!goal) {
      return null
    }

    goal.isExecuted = true

    return goal
  }

  async update(
    goalId: string,
    personId: string,
    goal: Prisma.GoalUncheckedUpdateInput
  ) {
    const person = this.goals.find(goal => goal.userPersonId === personId)

    if (!person) {
      return null
    }

    const existingGoal = this.goals.find(goal => goal.id === goalId)

    if (!existingGoal) {
      return null
    }

    const updatedGoal = {
      ...existingGoal,
      description: (goal.description as string) ?? existingGoal.description,
      numberDays: (goal.numberDays as number) ?? existingGoal.numberDays,
      updatedAt: new Date(),
    }

    const goalIndex = this.goals.findIndex(g => g.id === goalId)
    this.goals[goalIndex] = updatedGoal

    return updatedGoal
  }

  async delete(goalId: string, personId: string) {
    const person = this.goals.find(goal => goal.userPersonId === personId)

    if (!person) {
      return null
    }

    const goal = await this.findById(goalId)

    if (!goal) {
      return null
    }

    this.goals = this.goals.filter(g => g.id !== goalId)

    return goal
  }

  async fetchManyGoals(personId: string) {
    const person = this.goals.find(goal => goal.userPersonId === personId)

    if (!person) {
      return null
    }

    const goalsPerson = this.goals.filter(
      goal => goal.userPersonId === personId
    )

    return goalsPerson
  }
}
