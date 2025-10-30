import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { CvvCallsRepository } from '@/repositories/cvv-calls-repository'
import type { UserRepository } from '@/repositories/user-repository'
import type { CvvCalls } from '@prisma/client'

interface GetCvvCallsByPersonIdUseCaseRequest {
  userPersonId: string
}

interface GetCvvCallsByPersonIdUseCaseReply {
  cvvCalls: CvvCalls[]
}

export class GetCvvCallsByPersonIdUseCase {
  constructor(
    private cvvCallsRepository: CvvCallsRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    userPersonId,
  }: GetCvvCallsByPersonIdUseCaseRequest): Promise<GetCvvCallsByPersonIdUseCaseReply> {
    const user = await this.userRepository.getById(userPersonId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const cvvCalls = await this.cvvCallsRepository.getByPersonId(userPersonId)

    if (!cvvCalls) {
      throw new ResourceNotFoundError()
    }

    return { cvvCalls }
  }
}
