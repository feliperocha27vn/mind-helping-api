"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScheduling = void 0;
const invalid_parameters_1 = require("@/errors/invalid-parameters");
const person_not_found_1 = require("@/errors/person-not-found");
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const create_scheduling_use_case_1 = require("@/factories/scheduling/create-scheduling-use-case");
const zod_1 = __importDefault(require("zod"));
const createScheduling = async (app) => {
    app.post('/schedulings', {
        schema: {
            tags: ['Schedulings'],
            body: zod_1.default.object({
                professionalPersonId: zod_1.default.string(),
                userPersonId: zod_1.default.string(),
                scheduleId: zod_1.default.string(),
                hour: zod_1.default.string(),
                date: zod_1.default.string(),
            }),
            response: {
                201: zod_1.default.void(),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                406: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { professionalPersonId, userPersonId, scheduleId, hour, date } = request.body;
        const createSchedulingUseCase = (0, create_scheduling_use_case_1.makeCreateSchedulingUseCase)();
        try {
            await createSchedulingUseCase.execute({
                professionalPersonId,
                userPersonId,
                scheduleId,
                hour,
                date,
            });
            return reply.status(201).send();
        }
        catch (error) {
            if (error instanceof person_not_found_1.PersonNotFoundError ||
                error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            if (error instanceof invalid_parameters_1.InvalidParametersError) {
                return reply.status(406).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.createScheduling = createScheduling;
