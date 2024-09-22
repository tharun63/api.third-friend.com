import Joi, { string } from 'joi'
import { stringErrorHandler, objectId, arrayErrorHandler, numberErrorHandler, dateErrorHandler } from '../../../../helpers/joiHelpers'
import dataFormatConstants from '../../../../constants/dataFormatConstants'
import { JOURNEY_STATUS,MODE_OF_TRANSPORT } from '../../../../constants/journey'

Joi.objectId = objectId(Joi)

const currentYear = new Date().getFullYear();



const journeyDataSchema = {
    origin: Joi.string().max(40).regex(dataFormatConstants.CITY_REGEX).required().error(errors => stringErrorHandler(errors, 'Origin')),
    destination: Joi.string().max(40).required().regex(dataFormatConstants.CITY_REGEX).required().error(errors => stringErrorHandler(errors, 'Destination')),
    mode_of_transport: Joi.string()
    .valid(MODE_OF_TRANSPORT)
    .required()
    .error((errors) => stringErrorHandler(errors, "Mode Of Transport")),
    journey_status: Joi.string()
    .valid(JOURNEY_STATUS)
    .error((errors) => stringErrorHandler(errors, "Journey Status")),
    user: Joi.objectId()
    .disallow("")
    .error((errors) => stringErrorHandler(errors, "User")),
    pick_up_point: Joi.string().required().error(errors => stringErrorHandler(errors, 'Pick Up Point')),
    remarks: Joi.string().error(errors => stringErrorHandler(errors, 'Remarks')),
    journey_begins_on: Joi.date()
    .disallow("")
    .greater(Date.now() + 30 * 60 * 1000)
    .required()
    .iso()
    .error((errors) =>
      dateErrorHandler(errors, "Journey Begins On", "Today Date")
    ),
    journey_ends_on:Joi.date()
    .disallow("")
    .min(Joi.ref("journey_begins_on"))
    .required()
    .iso()
    .error((errors) =>
      dateErrorHandler(errors, "Journey Ends On", "Must be after 'Journey Begins On'")
    ),
    stops: Joi.array()
    .items(Joi.string())
    .error((errors) => arrayErrorHandler(errors, "stops", true)),
    max_weight: Joi.number().required().error((errors) =>
        numberErrorHandler(errors, "Max Weight")
    ),
    charge_per_kg: Joi.number().required().min(90).error((errors) =>
        numberErrorHandler(errors, "Charge Per Kg")
    ),
    
}
export const addJourneyDataSchema = Joi.object().keys(journeyDataSchema)
export const updateJourneyDataSchema = Joi.object().keys({
    ...journeyDataSchema,
    // journey_id: JoiObjectId().required()
})

