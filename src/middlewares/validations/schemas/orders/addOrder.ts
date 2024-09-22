import Joi, { string } from 'joi'
import { stringErrorHandler, objectId, arrayErrorHandler, numberErrorHandler, dateErrorHandler } from '../../../../helpers/joiHelpers'
import dataFormatConstants from '../../../../constants/dataFormatConstants'

Joi.objectId = objectId(Joi)

const orderDataSchema = {
    journey: Joi.objectId().required().error(errors => stringErrorHandler(errors, 'Journey ID')),
    user: Joi.objectId().required().error(errors => stringErrorHandler(errors, 'User ID')),
    drop_point: Joi.string().max(40).required().error(errors => stringErrorHandler(errors, 'Drop Point')),
    delivery_to: Joi.object().keys({
        name: Joi.string().required().error(errors => stringErrorHandler(errors, 'Delivery To Name')),
        mobile: Joi.string().required().regex(dataFormatConstants.INDIAN_PHONE_NUMBER_REGEX).error(errors => stringErrorHandler(errors, ' Delivery To Mobile')),
    }).required().error(errors => stringErrorHandler(errors, 'Delivery To')),
    bill_items: Joi.array().items(
        Joi.object({
            journey_name: Joi.string().max(50).required().error(errors => stringErrorHandler(errors, 'Journey Name')),
            total_amount: Joi.number().min(0).required().error(errors => numberErrorHandler(errors, 'Total Amount')),
            discount: Joi.number().min(0).required().error(errors => numberErrorHandler(errors, 'Discount')),
        }).required()
    ).min(1).error(errors => stringErrorHandler(errors, 'Bill Items'))
};


export const addOrderDataSchema = Joi.object().keys(orderDataSchema)
export const updateOrderDataSchema = Joi.object().keys({
    ...orderDataSchema,
})

