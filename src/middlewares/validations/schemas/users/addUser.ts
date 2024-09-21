import Joi, { string } from 'joi'
import { stringErrorHandler, objectId, arrayErrorHandler, numberErrorHandler } from '../../../../helpers/joiHelpers'
import dataFormatConstants from '../../../../constants/dataFormatConstants'
import { ALL_USERS } from '../../../../constants/user'

const JoiObjectId = objectId(Joi)

const currentYear = new Date().getFullYear();



const userDataSchema = {
    first_name: Joi.string().max(40).regex(dataFormatConstants.NAME_REGEX).required().error(errors => stringErrorHandler(errors, 'First Name')),
    last_name: Joi.string().max(40).required().regex(dataFormatConstants.NAME_REGEX).required().error(errors => stringErrorHandler(errors, 'Last Name')),
    email: Joi.string().required().regex(dataFormatConstants.EMAIL_REGEX).required().error((errors) => stringErrorHandler(errors, "Email")),
    phone: Joi.string().regex(dataFormatConstants.INDIAN_PHONE_NUMBER_REGEX).error(errors => stringErrorHandler(errors, 'Phone')),
    user_name: Joi.string()
        .required()
        .min(3)
        .max(60).regex((/[a-zA-Z]/) || (/(?:[A-Za-z].*?\d|\d.*?[A-Za-z])/)).error(errors => stringErrorHandler(errors, 'Username')),
    user_type: Joi.string().valid(ALL_USERS).required().error(errors => stringErrorHandler(errors, 'User Type')),
    password: Joi.string().error(errors => stringErrorHandler(errors, 'Password'))
    
}
export const addUserDataSchema = Joi.object().keys(userDataSchema)
export const updateUserDataSchema = Joi.object().keys({
    ...userDataSchema,
    user_id: JoiObjectId().required()
})

