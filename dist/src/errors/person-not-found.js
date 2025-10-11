"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonNotFoundError = void 0;
class PersonNotFoundError extends Error {
    constructor() {
        super('Person not found');
    }
}
exports.PersonNotFoundError = PersonNotFoundError;
