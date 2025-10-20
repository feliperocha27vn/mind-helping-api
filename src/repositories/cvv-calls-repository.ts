import type { CvvCalls, Prisma } from '@prisma/client'

export interface CvvCallsRepository {
  create(data: Prisma.CvvCallsUncheckedCreateInput): Promise<CvvCalls>
}
