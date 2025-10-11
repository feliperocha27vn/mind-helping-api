"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDailyRepository = void 0;
const node_crypto_1 = require("node:crypto");
class InMemoryDailyRepository {
    dailys = [];
    async create(data) {
        const daily = {
            id: data.id ?? (0, node_crypto_1.randomUUID)(),
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            userPersonId: data.userPersonId,
        };
        this.dailys.push(daily);
        return daily;
    }
}
exports.InMemoryDailyRepository = InMemoryDailyRepository;
