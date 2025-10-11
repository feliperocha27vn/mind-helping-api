"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidParametersError = void 0;
class InvalidParametersError extends Error {
    constructor() {
        super('Invalid parameters');
    }
}
exports.InvalidParametersError = InvalidParametersError;
