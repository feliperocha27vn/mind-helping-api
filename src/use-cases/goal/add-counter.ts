import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Goal } from '@prisma/client'

interface AddCounterUseCaseRequest {
  goalId: string
  personId: string
}

interface AddCounterUseCaseResponse {
  goal: Goal
}

export class AddCounterUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    goalId,
    personId,
  }: AddCounterUseCaseRequest): Promise<AddCounterUseCaseResponse> {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const goal = await this.goalRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (goal.counter <= goal.numberDays) {
      this.goalRepository.addCounter(goalId, personId)
    }

    return { goal }
  }
}
