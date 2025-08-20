import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Goal } from '@prisma/client'
import { differenceInDays } from 'date-fns'

interface InactivateOldGoalUseCaseRequest {
  goalId: string
  personId: string
}

interface InactivateOldGoalUseCaseResponse {
  goal: Goal
}

export class InactivateOldGoalUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    goalId,
    personId,
  }: InactivateOldGoalUseCaseRequest): Promise<InactivateOldGoalUseCaseResponse> {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    const daysPassed = differenceInDays(new Date(), goal.createdAt)

    if (daysPassed > 30) {
      this.goalRepository.updateInactivateOldGoal(goalId, personId)
    }

    return {
      goal,
    }
  }
}
