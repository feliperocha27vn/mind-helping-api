import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Goal } from '@prisma/client'

interface ExecuteGoalUseCaseRequest {
  goalId: string
  personId: string
}

interface ExecuteGoalUseCaseResponse {
  goal: Goal
}

export class ExecuteGoalUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    goalId,
    personId,
  }: ExecuteGoalUseCaseRequest): Promise<ExecuteGoalUseCaseResponse> {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    this.goalRepository.updateExecuteGoal(goalId, personId)

    return {
      goal,
    }
  }
}
