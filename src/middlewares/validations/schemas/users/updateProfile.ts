import Joi from 'joi';
import { stringErrorHandler,numberErrorHandler } from '../../../../helpers/joiHelpers';
import dataFormatConstants from '../../../../constants/dataFormatConstants';


const currentYear = new Date().getFullYear();

const addressSchema = Joi.object().keys({
  line_one: Joi.string().error(stringErrorHandler).error(errors => stringErrorHandler(errors, 'Address Line1')),
  line_two: Joi.string().error(stringErrorHandler).error(errors => stringErrorHandler(errors, 'Address Line2')),
  street: Joi.string().error(stringErrorHandler).error(errors => stringErrorHandler(errors, 'Street')),
  city: Joi.string().required().regex(dataFormatConstants.CITY_REGEX).error(errors => stringErrorHandler(errors, 'City')),
  state: Joi.string().required().error(stringErrorHandler).error(errors => stringErrorHandler(errors, 'State')),
  zip: Joi.string().required().regex(dataFormatConstants.INDIAN_ZIP_REGEX).min(5).max(5).error(errors => stringErrorHandler(errors, "Zip code")),
});

export const updateProfileDataSchema = Joi.object().keys({
  first_name: Joi.string().max(40).regex(dataFormatConstants.NAME_REGEX).required().error(errors => stringErrorHandler(errors, 'First Name')),
  last_name: Joi.string().required().max(40).regex(dataFormatConstants.NAME_REGEX).required().error(errors => stringErrorHandler(errors, 'Last Name')),
  email: Joi.string().email().required().error(errors => stringErrorHandler(errors, 'Email')),
  user_type: Joi.string().required().error(errors => stringErrorHandler(errors, 'User Type')),
  phone: Joi.string().regex(dataFormatConstants.INDIAN_PHONE_NUMBER_REGEX).error(errors => stringErrorHandler(errors, "Phone")),
  address: addressSchema,
});
