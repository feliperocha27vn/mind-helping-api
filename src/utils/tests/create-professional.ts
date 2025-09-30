import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createProfessional() {
  const person = await prisma.person.create({
    data: {
      name: 'Ana Clara Oliveira',
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
      email: 'ana.oliveira@example.com',
      password_hash: await hash('hashed-password', 6),
    },
  })

  const professional = await prisma.professional.create({
    data: {
      crp: '06/123456',
      person_id: person.id,
      voluntary: false,
    },
  })

  return { professional }
}
