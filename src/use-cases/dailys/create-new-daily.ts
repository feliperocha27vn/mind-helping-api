import { PersonNotFoundError } from '@/errors/person-not-found'
import type { DailyRepository } from '@/repositories/daily-repository'
import type { UserRepository } from '@/repositories/user-repository'
import type { Daily } from '@prisma/client'

interface CreateNewDailyRequest {
  userId: string
  content: string
}

interface CreateNewDailyReply {
  daily: Daily
}

export class CreateNewDaily {
  constructor(
    private dailyRepository: DailyRepository,
    private userPersonRepository: UserRepository
  ) {}

  async execute({
    userId,
    content,
  }: CreateNewDailyRequest): Promise<CreateNewDailyReply> {
    const user = await this.userPersonRepository.getById(userId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const daily = await this.dailyRepository.create({
      content,
      userPersonId: user.person_id,
    })

    return { daily }
  }
}
