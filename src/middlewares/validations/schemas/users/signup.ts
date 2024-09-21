import Joi from 'joi'
import { stringErrorHandler, objectId } from '../../../../helpers/joiHelpers'
import dataFormatConstants from '../../../../constants/dataFormatConstants'
// Joi.objectId = objectId(Joi)
export const signUpDataSchema = Joi.object().keys({
  first_name: Joi.string().required().regex(dataFormatConstants.NAME_REGEX).error(errors => stringErrorHandler(errors, 'First Name')),
  last_name: Joi.string().required().error(errors => stringErrorHandler(errors, 'Last Name')),
  email: Joi.string().email().required().error(errors => stringErrorHandler(errors, 'Email')),
  phone: Joi.string().regex(dataFormatConstants.INDIAN_PHONE_NUMBER_REGEX).error(errors => stringErrorHandler(errors, 'Phone')),
  username: Joi.string().error(errors => stringErrorHandler(errors, 'Username')),
  password: Joi.string().min(6).required().strict().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "any.empty":
          err.message = "Password is Missing!";
          break;
        case "any.required":
          err.message = "Password is Missing!";
          break;
        case "string.min":
          err.message = "Password must contain at least 6 Characters";
          break;
        default:
          break;
      }
    })
    return errors
  }),

  confirm_password: Joi.string().valid(Joi.ref('password')).error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "any.empty":
          err.message = "Please Confirm Your Password!";
          break;
        case "any.required":
          err.message = "Please Confirm Your Password!";
          break;
        case "any.allowOnly":
          err.message = "Password & Confirm Password Do Not Match";
          break;
        default:
          break;
      }
    })
    return errors
  }),
})

