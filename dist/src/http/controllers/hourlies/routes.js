"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hourliesRoutes = hourliesRoutes;
const fetch_many_by_schedule_id_1 = require("./fetch-many-by-schedule-id");
function hourliesRoutes(app) {
    app.register(fetch_many_by_schedule_id_1.fetchManyByScheduleId);
}
