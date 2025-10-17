import { prisma } from '@/lib/prisma'

export async function createDailys(userId: string) {
  await prisma.daily.createMany({
    data: [
      {
        content: 'Today I felt great!',
        userPersonId: userId,
        createdAt: new Date('2023-01-05T10:00:00Z'),
      },
      {
        content: 'Today I felt okay.',
        userPersonId: userId,
        createdAt: new Date('2023-01-10T10:00:00Z'),
      },
      {
        content: 'Today I felt bad.',
        userPersonId: userId,
        createdAt: new Date('2023-01-15T10:00:00Z'),
      },
    ],
  })

  const createdDailys = await prisma.daily.findMany({
    where: {
      userPersonId: userId,
    },
  })

  return {
    dailys: createdDailys,
  }
}
