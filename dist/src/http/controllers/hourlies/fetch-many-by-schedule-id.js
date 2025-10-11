"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyByScheduleId = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_fetch_many_by_schedule_id_use_case_1 = require("@/factories/hourlies/make-fetch-many-by-schedule-id-use-case");
const zod_1 = __importDefault(require("zod"));
const fetchManyByScheduleId = async (app) => {
    app.get('/hourlies/:scheduleId', {
        schema: {
            tags: ['Hourlies'],
            params: zod_1.default.object({
                scheduleId: zod_1.default.uuid(),
            }),
            response: {
                200: zod_1.default.object({
                    hourlies: zod_1.default
                        .object({
                        scheduleId: zod_1.default.string(),
                        date: zod_1.default.date(),
                        id: zod_1.default.string(),
                        hour: zod_1.default.string(),
                        isOcuped: zod_1.default.boolean(),
                    })
                        .array(),
                }),
                404: zod_1.default.object({
                    message: zod_1.default.string(),
                }),
                500: zod_1.default.object({
                    message: zod_1.default.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { scheduleId } = request.params;
        const fetchManyByScheduleIdUseCase = (0, make_fetch_many_by_schedule_id_use_case_1.makeFetchManyByScheduleIdUseCase)();
        try {
            const { hourlies } = await fetchManyByScheduleIdUseCase.execute({
                scheduleId,
            });
            return reply.status(200).send({ hourlies });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.fetchManyByScheduleId = fetchManyByScheduleId;
