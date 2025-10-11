"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const routes_1 = require("./http/controllers/feelings-user/routes");
const routes_2 = require("./http/controllers/goal/routes");
const routes_3 = require("./http/controllers/hourlies/routes");
const routes_4 = require("./http/controllers/person/routes");
const routes_5 = require("./http/controllers/professional/routes");
const routes_6 = require("./http/controllers/schedule/routes");
const routes_7 = require("./http/controllers/scheduling/routes");
exports.app = (0, fastify_1.default)().withTypeProvider();
exports.app.register(cors_1.default, {
    origin: true,
});
exports.app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
exports.app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
exports.app.register(swagger_1.default, {
    openapi: {
        info: {
            title: 'MindHelping API 🧠',
            version: '1.0.1',
        },
    },
    transform: fastify_type_provider_zod_1.jsonSchemaTransform,
});
exports.app.register(swagger_ui_1.default, {
    routePrefix: '/docs',
});
exports.app.register(routes_4.personRoutes);
exports.app.register(routes_5.routesProfessional);
exports.app.register(routes_2.routesGoal);
exports.app.register(routes_3.hourliesRoutes);
exports.app.register(routes_6.scheduleRoutes);
exports.app.register(routes_7.schedulingRoutes);
exports.app.register(routes_1.feelingsUserRoutes);
