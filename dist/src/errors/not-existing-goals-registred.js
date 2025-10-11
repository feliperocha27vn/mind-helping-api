"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotExistingGoalsRegisteredError = void 0;
class NotExistingGoalsRegisteredError extends Error {
    constructor() {
        super('No goals found for the specified person.');
    }
}
exports.NotExistingGoalsRegisteredError = NotExistingGoalsRegisteredError;
