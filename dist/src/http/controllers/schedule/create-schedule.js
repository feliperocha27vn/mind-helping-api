"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchedule = void 0;
const date_not_valid_1 = require("@/errors/date-not-valid");
const make_create_schedule_use_case_1 = require("@/factories/schedule/make-create-schedule-use-case");
const zod_1 = __importDefault(require("zod"));
const createSchedule = async (app) => {
    app.post('/schedules/:professionalPersonId', {
        schema: {
            tags: ['Schedules'],
            params: zod_1.default.object({
                professionalPersonId: zod_1.default.uuid(),
            }),
            body: zod_1.default
                .object({
                initialTime: zod_1.default.coerce.date(),
                endTime: zod_1.default.coerce.date(),
                interval: zod_1.default.number(),
                cancellationPolicy: zod_1.default.number(),
                averageValue: zod_1.default.number(),
                observation: zod_1.default.string().max(500),
                isControlled: zod_1.default.boolean(),
            })
                .array(),
            response: {
                201: zod_1.default.void(),
                400: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { professionalPersonId } = request.params;
        const schedules = request.body;
        const createScheduleUseCase = (0, make_create_schedule_use_case_1.makeCreateScheduleUseCase)();
        try {
            await createScheduleUseCase.execute({
                professionalPersonId,
                schedules,
            });
            return reply.status(201).send();
        }
        catch (error) {
            if (error instanceof date_not_valid_1.DateNotValidError) {
                return reply.status(400).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.createSchedule = createSchedule;
