"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeUser = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_get_me_user_use_case_1 = require("@/factories/person/make-get-me-user-use-case");
const zod_1 = __importDefault(require("zod"));
const getMeUser = async (app) => {
    app.get('/me/:userId', {
        schema: {
            tags: ['Users'],
            params: zod_1.default.object({
                userId: zod_1.default.string().uuid(),
            }),
            response: {
                200: zod_1.default.object({
                    profile: zod_1.default.object({
                        nameUser: zod_1.default.string(),
                        cityAndUf: zod_1.default.object({
                            city: zod_1.default.string(),
                            uf: zod_1.default.string(),
                        }),
                        lastFeeling: zod_1.default.string().optional(),
                        countExecutedGoals: zod_1.default.number(),
                    }),
                }),
                404: zod_1.default.object({ message: zod_1.default.string() }),
                500: zod_1.default.object({ message: zod_1.default.string() }),
            },
        },
    }, async (request, reply) => {
        const { userId } = request.params;
        const getMeUserUseCase = (0, make_get_me_user_use_case_1.makeGetMeUserUseCase)();
        try {
            const { profile } = await getMeUserUseCase.execute({ userId });
            return reply.status(200).send({ profile });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal server error.' });
        }
    });
};
exports.getMeUser = getMeUser;
