import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'

interface DeleteGoalUseCaseRequest {
  personId: string
  goalId: string
}

export class DeleteGoalUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({ goalId, personId }: DeleteGoalUseCaseRequest) {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    this.goalRepository.delete(goalId, personId)
  }
}
