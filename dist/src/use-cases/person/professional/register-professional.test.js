"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const in_memory_professional_repository_1 = require("@/in-memory-repository/in-memory-professional-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const register_professional_1 = require("./register-professional");
let professionalRepository;
let personRepository;
let sut;
(0, vitest_1.describe)('Register professional use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        sut = new register_professional_1.RegisterProfessionalUseCase(professionalRepository, personRepository);
    });
    (0, vitest_1.it)('should be able regiter', async () => {
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Dr. Maria Silva Santos',
            birth_date: '1985-03-15',
            cpf: '123.456.789-00',
            address: 'Rua das Flores',
            neighborhood: 'Centro',
            number: 1232,
            complement: 'Sala 201',
            cep: '01234-567',
            city: 'São Paulo',
            uf: 'SP',
            phone: '(11) 99999-8888',
            email: 'maria.santos@email.com',
            password_hash: await (0, bcryptjs_1.hash)('senha123', 6),
        });
        const { professional } = await sut.execute({
            person_id: person.id,
            crp: '06/123456',
            voluntary: true,
        });
        (0, vitest_1.expect)(professional.person_id).toEqual(vitest_1.expect.any(String));
    });
    (0, vitest_1.it)('should not be able de register', async () => {
        await (0, vitest_1.expect)(() => sut.execute({
            person_id: 'no-person-exists',
            crp: '06/123456',
            voluntary: false,
        })).rejects.toBeInstanceOf(resource_not_found_error_1.ResourceNotFoundError);
    });
});
