import { PersonNotFoundError } from '@/errors/person-not-found'
import type { CvvCallsRepository } from '@/repositories/cvv-calls-repository'
import type { UserRepository } from '@/repositories/user-repository'
import type { CvvCalls } from '@prisma/client'

interface CreateNewCvvCallUseCaseRequest {
  dateCalled: Date
  timeCalled: string
  userPersonId: string
}

interface CreateNewCvvCallUseCaseReply {
  cvvCall: CvvCalls
}

export class CreateNewCvvCallUseCase {
  constructor(
    private cvvCallsRepository: CvvCallsRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    dateCalled,
    timeCalled,
    userPersonId,
  }: CreateNewCvvCallUseCaseRequest): Promise<CreateNewCvvCallUseCaseReply> {
    const user = await this.userRepository.getById(userPersonId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const cvvCall = await this.cvvCallsRepository.create({
      dateCalled,
      timeCalled,
      userPersonId,
    })

    return { cvvCall }
  }
}
