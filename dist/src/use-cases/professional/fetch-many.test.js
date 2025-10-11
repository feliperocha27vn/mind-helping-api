"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_person_repository_1 = require("@/in-memory-repository/in-memory-person-repository");
const bcryptjs_1 = require("bcryptjs");
const vitest_1 = require("vitest");
const in_memory_professional_repository_1 = require("../../in-memory-repository/in-memory-professional-repository");
const fetch_many_1 = require("./fetch-many");
let personRepository;
let professionalRepository;
let sut;
(0, vitest_1.describe)('Fetch many professionals use case', () => {
    (0, vitest_1.beforeEach)(() => {
        personRepository = new in_memory_person_repository_1.InMemoryPersonRepository();
        professionalRepository = new in_memory_professional_repository_1.InMemoryProfessionalRepository(personRepository);
        sut = new fetch_many_1.FetchManyProfessionalsUseCase(professionalRepository);
    });
    (0, vitest_1.it)('should be able fetch many professionals', async () => {
        const person = await personRepository.create({
            id: 'person-01',
            name: 'Maria Silva Santos',
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
        const person2 = await personRepository.create({
            id: 'person-02',
            name: 'João Silva Santos',
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
        await professionalRepository.create({
            person_id: person.id,
            crp: '06/123456',
            voluntary: true,
        });
        await professionalRepository.create({
            person_id: person2.id,
            crp: '06/123457',
            voluntary: true,
        });
        const { professionals } = await sut.execute({ search: 'Silva' });
        (0, vitest_1.expect)(professionals).toEqual([
            vitest_1.expect.objectContaining({
                id: 'person-01',
                name: 'Maria Silva Santos',
            }),
            vitest_1.expect.objectContaining({
                id: 'person-02',
                name: 'João Silva Santos',
            }),
        ]);
    });
});
