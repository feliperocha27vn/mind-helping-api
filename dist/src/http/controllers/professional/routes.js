"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesProfessional = routesProfessional;
const fetch_many_1 = require("./fetch-many");
const get_by_id_1 = require("./get-by-id");
function routesProfessional(app) {
    app.register(fetch_many_1.fetchMany);
    app.register(get_by_id_1.getById);
}
