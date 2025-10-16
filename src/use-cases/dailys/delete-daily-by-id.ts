import { PersonNotFoundError } from '@/errors/person-not-found'
import type { DailyRepository } from '@/repositories/daily-repository'
import type { UserRepository } from '@/repositories/user-repository'

interface DeleteDailyByIdUseCaseRequest {
  dailyId: string
  userId: string
}

export class DeleteDailyByIdUseCase {
  constructor(
    private dailyRepository: DailyRepository,
    private userRepository: UserRepository
  ) {}

  async execute({ dailyId, userId }: DeleteDailyByIdUseCaseRequest) {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    await this.dailyRepository.deleteById(dailyId, userId)
  }
}
