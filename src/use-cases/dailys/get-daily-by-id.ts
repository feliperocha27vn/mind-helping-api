import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { DailyRepository } from '@/repositories/daily-repository'
import type { UserRepository } from '@/repositories/user-repository'
import type { Daily } from '@prisma/client'

interface GetDailyByIdUseCaseRequest {
  dailyId: string
  userId: string
}

interface GetDailyByIdUseCaseReply {
  daily: Daily
}

export class GetDailyByIdUseCase {
  constructor(
    private dailyRepository: DailyRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    dailyId,
    userId,
  }: GetDailyByIdUseCaseRequest): Promise<GetDailyByIdUseCaseReply> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const daily = await this.dailyRepository.getById(dailyId, userId)

    if (!daily) {
      throw new ResourceNotFoundError()
    }

    return { daily }
  }
}
