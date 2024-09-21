"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class FiltersHelper {
    users(query, filters) {
        if (filters.user_type) {
            query.user_type = filters.user_type;
        }
        if (filters.search_string && filters.search_string.trim()) {
            const searchPattern = new RegExp(filters.search_string.trim().replace(/\s/, "|"), "ig");
            query.$or = [
                { username: searchPattern },
                { first_name: searchPattern },
                { last_name: searchPattern },
            ];
        }
        if (filters.username && filters.username.trim()) {
            const searchPattern = new RegExp(filters.username.trim().replace(/\s/, "|"), "ig");
            query.username = searchPattern;
        }
        if (filters.name && filters.name.trim()) {
            const searchPattern = new RegExp(filters.name.trim().replace(/\s/, "|"), "ig");
            query.$or = [{ first_name: searchPattern }, { last_name: searchPattern }];
        }
        if (filters.status) {
            query.status = filters.status;
        }
        else {
            query.status = { $ne: "ARCHIVED" };
        }
        return query;
    }
    journeys(query, filters) {
        if (filters.mode_of_transport) {
            query.mode_of_transport = filters.mode_of_transport;
        }
        if (filters.search_string && filters.search_string.trim()) {
            const searchPattern = new RegExp(filters.search_string.trim().replace(/\s/, "|"), "ig");
            query.$or = [
                { origin: searchPattern },
                { destination: searchPattern }
            ];
        }
        if (filters.from_date && filters.to_date) {
            query.journey_begins_on = {
                $gte: moment_1.default.utc(filters.from_date).format(),
                $lte: moment_1.default.utc(filters.to_date).format(),
            };
        }
        if (filters.journey_status) {
            query.status = filters.journey_status;
        }
        else {
            query.status = { $nin: ["ENDED", "CANCELLED", "ARCHIVED"] };
        }
        return query;
    }
}
exports.default = new FiltersHelper();
//# sourceMappingURL=filterHelper.js.map