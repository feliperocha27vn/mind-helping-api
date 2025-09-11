import { prisma } from '@/lib/prisma'

export async function createGoalWithPrisma() {
  // Primeiro criar a Person
  const person = await prisma.person.create({
    data: {
      name: 'Ana Clara Oliveira',
      address: 'Avenida Brasil',
      neighborhood: 'Centro',
      number: 1500,
      complement: 'Sala 32',
      cep: '16200001',
      city: 'Birigui',
      uf: 'SP',
      phone: '(18) 99123-4567',
      email: 'ana.oliveira@example.com',
      password_hash: 'umaSenhaForte!@#',
      birth_date: new Date('1992-08-25'),
      cpf: '123.456.789-00',
    },
  })

  // Depois criar o User vinculado à Person
  const user = await prisma.user.create({
    data: {
      person_id: person.id,
      gender: 'F',
    },
  })

  const goal = await prisma.goal.create({
    data: {
      userPersonId: user.person_id, // Usar o person_id do User
      description: 'New Goal',
      numberDays: 5,
    },
  })

  return { person, user, goal }
}
