import { NotExistingGoalsRegisteredError } from '@/errors/not-existing-goals-registred'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Goal } from '@prisma/client'

interface FetchManyGoalsUseCaseRequest {
  personId: string
}

interface FetchManyGoalsUseCaseResponse {
  goals: Goal[]
}

export class FetchManyGoalsUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    personId,
  }: FetchManyGoalsUseCaseRequest): Promise<FetchManyGoalsUseCaseResponse> {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const goals = await this.goalRepository.fetchManyGoals(personId)

    if (!goals) {
      throw new NotExistingGoalsRegisteredError()
    }

    return { goals }
  }
}
