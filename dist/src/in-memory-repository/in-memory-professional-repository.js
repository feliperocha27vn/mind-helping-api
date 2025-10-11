"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProfessionalRepository = void 0;
class InMemoryProfessionalRepository {
    items = [];
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async create(data) {
        const professional = {
            person_id: data.person_id,
            crp: data.crp,
            voluntary: data.voluntary,
        };
        this.items.push(professional);
        return professional;
    }
    async fetchMany(search) {
        // Filtra as pessoas que correspondem à busca
        const filteredPersons = this.personRepository.items.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()));
        // Busca os profissionais que correspondem às pessoas filtradas e retorna os dados combinados
        const professionals = this.items
            .filter(professional => filteredPersons.some(person => person.id === professional.person_id))
            .map(professional => {
            const person = filteredPersons.find(person => person.id === professional.person_id);
            if (!person)
                return null;
            return {
                id: person.id,
                name: person.name,
                email: person.email,
                phone: person.phone,
                address: person.address,
                neighborhood: person.neighborhood,
                city: person.city,
                uf: person.uf,
                voluntary: professional.voluntary,
            };
        })
            .filter((item) => item !== null);
        return professionals;
    }
    async getById(professionalId) {
        const professional = this.items.find(item => item.person_id === professionalId);
        if (!professional) {
            return null;
        }
        const person = this.personRepository.items.find(person => person.id === professional.person_id);
        if (!person) {
            return null;
        }
        return {
            id: person.id,
            name: person.name,
            email: person.email,
            phone: person.phone,
            address: person.address,
            neighborhood: person.neighborhood,
            city: person.city,
            uf: person.uf,
            voluntary: professional.voluntary,
        };
    }
}
exports.InMemoryProfessionalRepository = InMemoryProfessionalRepository;
