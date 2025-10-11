"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalCanOnlyBeExecutedOnceError = void 0;
class GoalCanOnlyBeExecutedOnceError extends Error {
    constructor() {
        super('Goal can only be executed once');
    }
}
exports.GoalCanOnlyBeExecutedOnceError = GoalCanOnlyBeExecutedOnceError;
