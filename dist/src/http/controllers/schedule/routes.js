"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRoutes = scheduleRoutes;
const create_schedule_1 = require("./create-schedule");
const fetch_many_schedule_1 = require("./fetch-many-schedule");
function scheduleRoutes(app) {
    app.register(create_schedule_1.createSchedule);
    app.register(fetch_many_schedule_1.fetchManySchedule);
}
