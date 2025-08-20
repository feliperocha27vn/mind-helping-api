import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import type { Person } from '@prisma/client'
import { hash } from 'bcryptjs'
import { InvalidParametersError } from '../../errors/invalid-parameters'
import type { PersonRepository } from '../../repositories/person-repository'

interface RegisterUseCaseRequest {
  name: string
  birth_date: Date | string
  cpf: string
  address: string
  neighborhood: string
  number: number
  complement: string
  cepUser: string
  city: string
  uf: string
  phone: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  person: Person
}

export class RegisterUseCase {
  constructor(private registerPersonRepository: PersonRepository) {}

  async execute({
    name,
    birth_date,
    cpf,
    address,
    neighborhood,
    number,
    complement,
    cepUser,
    city,
    uf,
    phone,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const cleanCep = cepUser.replace('-', '')
    const cep = /^\d{8}$/.test(cleanCep)

    if (!cep) {
      throw new InvalidParametersError()
    }

    const emailAlreadyExists =
      await this.registerPersonRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const person = await this.registerPersonRepository.create({
      name,
      birth_date,
      cpf,
      address,
      neighborhood,
      number,
      complement,
      cep: cepUser,
      city,
      uf,
      phone,
      email,
      password_hash,
    })

    return {
      person,
    }
  }
}
