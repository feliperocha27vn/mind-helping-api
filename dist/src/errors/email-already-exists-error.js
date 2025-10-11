"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = void 0;
class EmailAlreadyExistsError extends Error {
    constructor() {
        super('Email Already Exists Error');
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
