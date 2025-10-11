"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotExistingSchedulesError = void 0;
class NotExistingSchedulesError extends Error {
    constructor() {
        super('No existing schedules found');
    }
}
exports.NotExistingSchedulesError = NotExistingSchedulesError;
