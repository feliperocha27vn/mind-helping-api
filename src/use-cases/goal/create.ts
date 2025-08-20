import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Goal } from '@prisma/client'

interface CreateGoalUseCaseRequest {
  userPersonId: string
  description: string
  numberDays: number
}

interface CreateGoalUseCaseResponse {
  goal: Goal
}

export class CreateGoalUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    userPersonId,
    description,
    numberDays,
  }: CreateGoalUseCaseRequest): Promise<CreateGoalUseCaseResponse> {
    const person = await this.personRepository.findById(userPersonId)

    if (!person) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalRepository.create({
      userPersonId,
      description,
      numberDays,
    })

    return {
      goal,
    }
  }
}
