import { JourneyModel } from "../../models/journey";

export class JourneyDataServiceProvider {


  public async saveJourney(journeyData) {
    return await JourneyModel.create(journeyData);
  }

 
  async updateJourneyById(journeyId, data) {
    return JourneyModel.updateOne({ _id: journeyId }, { $set: data });
  }

  async getJourneyById(journeyId) {
    return JourneyModel.findOne({ _id: journeyId });
  }

  async updateJourneyByQuery(query, data) {
    return JourneyModel.updateOne(query, { $set: data });
  }

  async journeyExists(query) {
    const journeysCount = await JourneyModel.countDocuments(query);
    return journeysCount ? true : false;
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
