"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.default = new FiltersHelper();
//# sourceMappingURL=filterHelper.js.map