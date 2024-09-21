"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJourneyDataSchema = exports.addJourneyDataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joiHelpers_1 = require("../../../../helpers/joiHelpers");
const dataFormatConstants_1 = __importDefault(require("../../../../constants/dataFormatConstants"));
const journey_1 = require("../../../../constants/journey");
const JoiObjectId = (0, joiHelpers_1.objectId)(joi_1.default);
const currentYear = new Date().getFullYear();
const journeyDataSchema = {
    origin: joi_1.default.string().max(40).regex(dataFormatConstants_1.default.CITY_REGEX).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Origin')),
    destination: joi_1.default.string().max(40).required().regex(dataFormatConstants_1.default.CITY_REGEX).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Destination')),
    mode_of_transport: joi_1.default.string()
        .valid(journey_1.MODE_OF_TRANSPORT)
        .required()
        .error((errors) => (0, joiHelpers_1.stringErrorHandler)(errors, "Mode Of Transport")),
    journey_status: joi_1.default.string()
        .valid(journey_1.JOURNEY_STATUS)
        .error((errors) => (0, joiHelpers_1.stringErrorHandler)(errors, "Journey Status")),
    pick_up_point: joi_1.default.string().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Pick Up Point')),
    remarks: joi_1.default.string().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Remarks')),
    journey_begins_on: joi_1.default.date()
        .disallow("")
        .greater(Date.now() + 30 * 60 * 1000)
        .required()
        .iso()
        .error((errors) => (0, joiHelpers_1.dateErrorHandler)(errors, "Journey Begins On", "Today Date")),
    journey_ends_on: joi_1.default.date()
        .disallow("")
        .min(joi_1.default.ref("journey_begins_on"))
        .required()
        .iso()
        .error((errors) => (0, joiHelpers_1.dateErrorHandler)(errors, "Journey Ends On", "Must be after 'Journey Begins On'")),
    stops: joi_1.default.array()
        .items(joi_1.default.string())
        .error((errors) => (0, joiHelpers_1.arrayErrorHandler)(errors, "stops", true)),
    max_weight: joi_1.default.number().required().error((errors) => (0, joiHelpers_1.numberErrorHandler)(errors, "Max Weight")),
    charge_per_kg: joi_1.default.number().required().error((errors) => (0, joiHelpers_1.numberErrorHandler)(errors, "Charge Per Kg")),
};
exports.addJourneyDataSchema = joi_1.default.object().keys(journeyDataSchema);
exports.updateJourneyDataSchema = joi_1.default.object().keys(Object.assign(Object.assign({}, journeyDataSchema), { journey_id: JoiObjectId().required() }));
//# sourceMappingURL=addJourney.js.map