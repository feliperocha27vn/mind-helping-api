"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManySchedule = void 0;
const not_existing_schedules_1 = require("@/errors/not-existing-schedules");
const make_fetch_many_schedule_use_case_1 = require("@/factories/schedule/make-fetch-many-schedule-use-case");
const zod_1 = __importDefault(require("zod"));
const fetchManySchedule = async (app) => {
    app.get('/schedules/:professionalId', {
        schema: {
            tags: ['Schedules'],
            params: zod_1.default.object({
                professionalId: zod_1.default.uuid(),
            }),
            response: {
                200: zod_1.default.object({
                    schedules: zod_1.default
                        .object({
                        id: zod_1.default.uuid(),
                        professionalPersonId: zod_1.default.uuid(),
                        initialTime: zod_1.default.date().nullable(),
                        endTime: zod_1.default.date().nullable(),
                        interval: zod_1.default.number(),
                        cancellationPolicy: zod_1.default.number(),
                        averageValue: zod_1.default.coerce.string(),
                        observation: zod_1.default.string().nullable(),
                        isControlled: zod_1.default.boolean(),
                        createdAt: zod_1.default.date(),
                    })
                        .array(),
                }),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { professionalId } = request.params;
        const fetchManySchedulesUseCase = (0, make_fetch_many_schedule_use_case_1.makeFetchManyScheduleUseCase)();
        try {
            const { schedules } = await fetchManySchedulesUseCase.execute({
                professionalId,
            });
            return reply.status(200).send({ schedules });
        }
        catch (error) {
            if (error instanceof not_existing_schedules_1.NotExistingSchedulesError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
};
exports.fetchManySchedule = fetchManySchedule;
