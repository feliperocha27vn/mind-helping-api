"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchedulingByUserId = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_get_scheduling_use_case_1 = require("@/factories/scheduling/make-get-scheduling-use-case");
const zod_1 = __importDefault(require("zod"));
const getSchedulingByUserId = async (app) => {
    app.get('/schedulings/:userId', {
        schema: {
            tags: ['Schedulings'],
            params: zod_1.default.object({
                userId: zod_1.default.uuid(),
            }),
            response: {
                200: zod_1.default.object({
                    schedulingDetails: zod_1.default.object({
                        id: zod_1.default.string(),
                        nameProfessional: zod_1.default.string(),
                        phoneProfessional: zod_1.default.string(),
                        emailProfessional: zod_1.default.string(),
                        date: zod_1.default.date(),
                        hour: zod_1.default.string(),
                        address: zod_1.default.object({
                            street: zod_1.default.string(),
                            neighborhood: zod_1.default.string(),
                            complement: zod_1.default.string(),
                            cep: zod_1.default.string(),
                            city: zod_1.default.string(),
                            uf: zod_1.default.string(),
                        }),
                    }),
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
        const { userId } = request.params;
        const getSchedulingUseCase = (0, make_get_scheduling_use_case_1.makeGetSchedulingUseCase)();
        try {
            const { schedulingDetails } = await getSchedulingUseCase.execute({
                userId,
            });
            return reply.status(200).send({ schedulingDetails });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
};
exports.getSchedulingByUserId = getSchedulingByUserId;
