import { JourneyModel } from "../../models/journey";
const saltRounds = 12;

export class JourneyDataServiceProvider {


  public async saveJourney(journeyData) {
    return await JourneyModel.create(journeyData);
  }

 
  async updateJourneyById(journeyId, data) {
    return JourneyModel.updateOne({ _id: journeyId }, { $set: data });
  }
  async updateJourneyByQuery(query, data) {
    return JourneyModel.updateOne(query, { $set: data });
  }

  async getAllJourneys({
    query = {},
    skip = null,
    limit = null,
    sort = {},
    projection = {},
    lean = false,
  }) {
    if (lean) {
      return JourneyModel.find(query)
        .collation({ locale: "en" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .lean();
    }
    return JourneyModel.find(query)
      .collation({ locale: "en" })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection);
  }

  async countAllJourneys(query = {}) {
    return JourneyModel.countDocuments(query);
  }

}
