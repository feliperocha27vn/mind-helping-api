"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
const crypto_1 = require("crypto");
class InMemoryUserRepository {
    items = [];
    async create(data) {
        const user = {
            person_id: data.person_id ?? (0, crypto_1.randomUUID)(),
            gender: data.gender,
        };
        this.items.push(user);
        return user;
    }
    async getById(personId) {
        const user = this.items.find(item => item.person_id === personId);
        if (!user) {
            return null;
        }
        return user;
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
