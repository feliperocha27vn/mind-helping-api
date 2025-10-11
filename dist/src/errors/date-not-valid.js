"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateNotValidError = void 0;
class DateNotValidError extends Error {
    constructor() {
        super('Date is not valid');
    }
}
exports.DateNotValidError = DateNotValidError;
