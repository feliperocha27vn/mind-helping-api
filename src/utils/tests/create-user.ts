import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function createUser() {
  const uniqueId = randomUUID().substring(0, 8)
  const person = await prisma.person.create({
    data: {
      name: 'Roberto Silva',
      birth_date: new Date('1992-08-25T00:00:00Z'),
      cpf: `${uniqueId.substring(0, 3)}.456.789-00`,
      address: 'Avenida Brasil',
      neighborhood: 'Centro',
      number: 1500,
      complement: 'Sala 32',
      cep: '16200-001',
      city: 'Birigui',
      uf: 'SP',
      phone: '(18) 99123-4567',
      email: `user-${uniqueId}@example.com`,
      password_hash: await hash('hashed-password', 6),
    },
  })

  const user = await prisma.user.create({
    data: {
      gender: 'male',
      person_id: person.id,
    },
  })

  return { user, person }
}
