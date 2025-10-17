import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createUser() {
  const person = await prisma.person.create({
    data: {
      name: 'Roberto Silva',
      birth_date: new Date('1992-08-25'),
      cpf: '123.456.789-00',
      address: 'Avenida Brasil',
      neighborhood: 'Centro',
      number: 1500,
      complement: 'Sala 32',
      cep: '16200-001',
      city: 'Birigui',
      uf: 'SP',
      phone: '(18) 99123-4567',
      email: 'roberto.silva@example.com',
      password_hash: await hash('hashed-password', 6),
    },
  })

  const user = await prisma.user.create({
    data: {
      gender: 'male',
      person_id: person.id,
    },
  })

  return { user }
}
