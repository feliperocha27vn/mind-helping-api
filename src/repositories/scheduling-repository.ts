import type { Prisma, Scheduling } from '@prisma/client'

export interface SchedulingRepository {
  create(data: Prisma.SchedulingUncheckedCreateInput): Promise<Scheduling>
  getByUserId(userId: string): Promise<Scheduling | null>
}
