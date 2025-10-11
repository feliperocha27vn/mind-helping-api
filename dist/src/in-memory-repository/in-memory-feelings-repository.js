"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryFeelingsRepository = void 0;
const date_fns_1 = require("date-fns");
const node_crypto_1 = require("node:crypto");
class InMemoryFeelingsRepository {
    items = [];
    async create(data) {
        const feeling = {
            id: data.id ?? (0, node_crypto_1.randomUUID)(),
            description: data.description,
            motive: data.motive ?? null,
            userPersonId: data.userPersonId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.items.push(feeling);
        return feeling;
    }
    async getLastFeelingsByUserId(userId) {
        const feelings = this.items.filter(item => item.userPersonId === userId);
        const lastFeeling = feelings[feelings.length - 1];
        if (!lastFeeling) {
            return null;
        }
        return lastFeeling;
    }
    async getFeelingsByDate(userId, startDay, endDay) {
        const feelingsByDate = this.items.filter(item => {
            const userMatch = item.userPersonId === userId;
            const dateInRange = (0, date_fns_1.isWithinInterval)(item.createdAt, {
                start: startDay,
                end: endDay,
            });
            return userMatch && dateInRange;
        });
        return feelingsByDate.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
}
exports.InMemoryFeelingsRepository = InMemoryFeelingsRepository;
