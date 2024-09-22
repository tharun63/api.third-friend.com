"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyController = void 0;
const journey_1 = require("../services/database/journey");
const customError_1 = require("../interfaces/customError");
const filterHelper_1 = __importDefault(require("../helpers/filterHelper"));
const paginationHelpers_1 = __importDefault(require("../helpers/paginationHelpers"));
const journeyDataServiceProvider = new journey_1.JourneyDataServiceProvider();
class JourneyController {
    async AddJourney(req, res, next) {
        try {
            let journeyData = req.body;
            journeyData.user = req.user._id;
            const exists = await journeyDataServiceProvider.journeyExists({
                user: journeyData.user,
                journey_begins_on: journeyData.journey_begins_on
            });
            if (exists) {
                const err = new customError_1.CustomError();
                err.status = 409;
                err.message = "Journey with this is already existed at the same time";
                throw err;
            }
            let savedJourney = await journeyDataServiceProvider.saveJourney(journeyData);
            return res.status(201).json({
                success: true,
                message: "Journey Registered  Successfully!",
                data: savedJourney
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updateJourney(req, res, next) {
        try {
            let journey = req.body;
            await journeyDataServiceProvider.updateJourneyById(req.params.journey_id, journey);
            return res.status(200).json({
                success: true,
                message: "Journey updated successfully",
            });
        }
        catch (error) {
            let respData = {
                success: false,
                message: error.message,
            };
            return res.status(error.statusCode || 500).json(respData);
        }
    }
    async getJourneyById(req, res, next) {
        try {
            let data = await journeyDataServiceProvider.getJourneyById(req.params.journey_id);
            return res.status(200).json({
                success: true,
                message: "Journey data fetched successfully",
                data: data,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async getAllJourneys(req, res, next) {
        try {
            let { skip, limit, sort, projection } = req.parsedFilterParams;
            let { query = {} } = req.parsedFilterParams;
            query = filterHelper_1.default.journeys(query, req.query);
            sort.updated_at = -1;
            const [journeys = [], count = 0] = await Promise.all([
                journeyDataServiceProvider.getAllJourneys({ query, skip, limit, sort, projection, }),
                journeyDataServiceProvider.countAllJourneys(query),
            ]);
            const response = paginationHelpers_1.default.getPaginationResponse({
                page: req.query.page || 1,
                count,
                limit,
                skip,
                data: journeys,
                message: "All Journeys fetched successfully",
                searchString: req.query.search_string,
            });
            return res.json(response);
        }
        catch (err) {
            return err;
        }
    }
    async deleteJourney(req, res, next) {
        try {
            const { journey_id: journeyId } = req.params;
            let journeyData = await journeyDataServiceProvider.getJourneyById(journeyId);
            await journeyDataServiceProvider.updateJourneyById(journeyId, {
                journey_status: "ARCHIVED",
                deleted_on: new Date(),
            });
            return res.status(200).json({
                success: true,
                message: "Journey deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.JourneyController = JourneyController;
//# sourceMappingURL=journeyController.js.map