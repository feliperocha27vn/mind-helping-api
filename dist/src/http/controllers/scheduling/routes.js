"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulingRoutes = schedulingRoutes;
const create_scheduling_1 = require("./create-scheduling");
const get_by_user_id_1 = require("./get-by-user-id");
function schedulingRoutes(app) {
    app.register(create_scheduling_1.createScheduling);
    app.register(get_by_user_id_1.getSchedulingByUserId);
}
