"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyDataServiceProvider = void 0;
const journey_1 = require("../../models/journey");
const saltRounds = 12;
class JourneyDataServiceProvider {
    async saveJourney(journeyData) {
        return await journey_1.JourneyModel.create(journeyData);
    }
    async updateJourneyById(journeyId, data) {
        return journey_1.JourneyModel.updateOne({ _id: journeyId }, { $set: data });
    }
    async updateJourneyByQuery(query, data) {
        return journey_1.JourneyModel.updateOne(query, { $set: data });
    }
    async getAllJourneys({ query = {}, skip = null, limit = null, sort = {}, projection = {}, lean = false, }) {
        if (lean) {
            return journey_1.JourneyModel.find(query)
                .collation({ locale: "en" })
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select(projection)
                .lean();
        }
        return journey_1.JourneyModel.find(query)
            .collation({ locale: "en" })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(projection);
    }
    async countAllJourneys(query = {}) {
        return journey_1.JourneyModel.countDocuments(query);
    }
}
exports.JourneyDataServiceProvider = JourneyDataServiceProvider;
//# sourceMappingURL=journey.js.map