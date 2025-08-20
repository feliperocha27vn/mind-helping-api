import { GoalCanOnlyBeExecutedOnceError } from '@/errors/goal-can-only-be-executed-once'
import { InvalidParametersError } from '@/errors/invalid-parameters'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Goal } from '@prisma/client'

interface UpdateGoalUseCaseRequest {
  userPersonId: string
  goalId: string
  description?: string | undefined
  numberDays?: number | undefined
}

interface UpdateGoalUseCaseResponse {
  goal: Goal
}

export class UpdateGoalUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    userPersonId,
    goalId,
    description,
    numberDays,
  }: UpdateGoalUseCaseRequest): Promise<UpdateGoalUseCaseResponse> {
    const person = await this.personRepository.findById(userPersonId)

    if (!person) {
      throw new InvalidParametersError()
    }

    const goal = await this.goalRepository.findById(goalId)

    if (!goal) {
      throw new InvalidParametersError()
    }

    if (goal.isExecuted === true) {
      throw new GoalCanOnlyBeExecutedOnceError()
    }

    const updatedGoal = await this.goalRepository.update(goalId, userPersonId, {
      description,
      numberDays,
    })

    return { goal: updatedGoal as Goal }
  }
}
