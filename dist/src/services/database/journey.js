"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyDataServiceProvider = void 0;
const journey_1 = require("../../models/journey");
class JourneyDataServiceProvider {
    async saveJourney(journeyData) {
        return await journey_1.JourneyModel.create(journeyData);
    }
    async updateJourneyById(journeyId, data) {
        return journey_1.JourneyModel.updateOne({ _id: journeyId }, { $set: data });
    }
    async getJourneyById(journeyId) {
        return journey_1.JourneyModel.findOne({ _id: journeyId });
    }
    async updateJourneyByQuery(query, data) {
        return journey_1.JourneyModel.updateOne(query, { $set: data });
    }
    async journeyExists(query) {
        const journeysCount = await journey_1.JourneyModel.countDocuments(query);
        return journeysCount ? true : false;
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