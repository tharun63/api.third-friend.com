import Joi from 'joi'
import { stringErrorHandler } from '../../../../helpers/joiHelpers'
export const forgotPasswordDataSchema = Joi.object().keys({
    email: Joi.string().required().error(errors => stringErrorHandler(errors, 'Email'))
})