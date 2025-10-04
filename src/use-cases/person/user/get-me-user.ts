import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'

interface GetMeUserUseCaseRequest {
  userId: string
}

interface GetMeUserUseCaseReply {
  profile: {
    nameUser: string
    cityAndUf: {
      city: string
      uf: string
    }
    lastFeeling: string
    countExecutedGoals: number
  }
}

export class GetMeUserUseCase {
  constructor(
    private personRepository: PersonRepository,
    private feelingsRepository: FeelingsRepository,
    private goalRepository: GoalRepository
  ) {}

  async execute({
    userId,
  }: GetMeUserUseCaseRequest): Promise<GetMeUserUseCaseReply> {
    const personUser = await this.personRepository.findById(userId)

    if (!personUser) {
      throw new PersonNotFoundError()
    }

    const lastFeeling =
      await this.feelingsRepository.getLastFeelingsByUserId(userId)

    if (!lastFeeling) {
      throw new ResourceNotFoundError()
    }

    const countExecutedGoals = await this.goalRepository.getCountExecutedGoals(
      personUser.id
    )

    const profile = {
      nameUser: personUser.name,
      cityAndUf: {
        city: personUser.city,
        uf: personUser.uf,
      },
      lastFeeling: lastFeeling.description,
      countExecutedGoals: countExecutedGoals ?? 0,
    }

    return { profile }
  }
}
