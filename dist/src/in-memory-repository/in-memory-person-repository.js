"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPersonRepository = void 0;
const node_crypto_1 = require("node:crypto");
class InMemoryPersonRepository {
    items = [];
    async create(data) {
        const person = {
            id: data.id ?? (0, node_crypto_1.randomUUID)(),
            name: data.name,
            birth_date: new Date(data.birth_date),
            cpf: data.cpf,
            address: data.address,
            neighborhood: data.neighborhood,
            number: data.number,
            complement: data.complement,
            cep: data.cep,
            city: data.city,
            uf: data.uf,
            phone: data.phone,
            email: data.email,
            password_hash: data.password_hash,
        };
        this.items.push(person);
        return person;
    }
    async findById(personId) {
        const person = this.items.find(item => item.id === personId);
        if (!person) {
            return null;
        }
        return person;
    }
    async findByEmail(email) {
        const person = this.items.find(item => item.email === email);
        if (!person) {
            return null;
        }
        return person;
    }
}
exports.InMemoryPersonRepository = InMemoryPersonRepository;
