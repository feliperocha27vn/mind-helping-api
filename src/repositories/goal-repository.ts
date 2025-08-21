import type { Goal, Prisma } from '@prisma/client'

export interface GoalRepository {
  create(data: Prisma.GoalUncheckedCreateInput): Promise<Goal>
  findById(goalId: string): Promise<Goal | null>
  updateInactivateOldGoal(goalId: string, personId: string): void
  updateExecuteGoal(goalId: string, personId: string): void
  update(
    goalId: string,
    personId: string,
    goal: Prisma.GoalUncheckedUpdateInput
  ): Promise<Goal | null>
  delete(goalId: string, personId: string): void
  fetchManyGoals(personId: string): Promise<Goal[] | null>
}
