"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryGoalRepository = void 0;
class InMemoryGoalRepository {
    goals = [];
    async create(data) {
        const goal = {
            id: data.id ?? crypto.randomUUID(),
            userPersonId: data.userPersonId,
            description: data.description,
            numberDays: data.numberDays,
            isExecuted: data.isExecuted ?? false,
            isExpire: data.isExpire ?? false,
            counter: data.counter ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.goals.push(goal);
        return goal;
    }
    async findById(id) {
        const goal = this.goals.find(goal => goal.id === id);
        if (!goal) {
            return null;
        }
        return goal;
    }
    async updateInactivateOldGoal(goalId, personId) {
        const person = this.goals.find(goal => goal.userPersonId === personId);
        if (!person) {
            return null;
        }
        const goal = await this.findById(goalId);
        if (!goal) {
            return null;
        }
        goal.isExpire = true;
        return goal;
    }
    async updateExecuteGoal(goalId, personId) {
        const person = this.goals.find(goal => goal.userPersonId === personId);
        if (!person) {
            return null;
        }
        const goal = await this.findById(goalId);
        if (!goal) {
            return null;
        }
        goal.isExecuted = true;
        return goal;
    }
    async update(goalId, personId, goal) {
        const person = this.goals.find(goal => goal.userPersonId === personId);
        if (!person) {
            return null;
        }
        const existingGoal = this.goals.find(goal => goal.id === goalId);
        if (!existingGoal) {
            return null;
        }
        const updatedGoal = {
            ...existingGoal,
            description: goal.description ?? existingGoal.description,
            numberDays: goal.numberDays ?? existingGoal.numberDays,
            updatedAt: new Date(),
        };
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        this.goals[goalIndex] = updatedGoal;
        return updatedGoal;
    }
    async delete(goalId, personId) {
        const person = this.goals.find(goal => goal.userPersonId === personId);
        if (!person) {
            return null;
        }
        const goal = await this.findById(goalId);
        if (!goal) {
            return null;
        }
        this.goals = this.goals.filter(g => g.id !== goalId);
        return goal;
    }
    async fetchManyGoals(personId) {
        const person = this.goals.find(goal => goal.userPersonId === personId);
        if (!person) {
            return null;
        }
        const goalsPerson = this.goals.filter(goal => goal.userPersonId === personId);
        return goalsPerson;
    }
    async addCounter(goalId, personId) {
        const goal = this.goals.find(goal => goal.id === goalId && goal.userPersonId === personId);
        if (!goal) {
            return null;
        }
        goal.counter += 1;
        return goal;
    }
    async getCountExecutedGoals(personId) {
        const goalCount = this.goals.filter(goal => goal.userPersonId === personId && goal.isExecuted === true).length;
        return goalCount;
    }
}
exports.InMemoryGoalRepository = InMemoryGoalRepository;
