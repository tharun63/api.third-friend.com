import Joi from 'joi';
import { stringErrorHandler } from '../../../../helpers/joiHelpers';
import dataFormatConstants from '../../../../constants/dataFormatConstants';

export const signInDataSchema = Joi.object().keys({
  email: Joi.string().required().regex(dataFormatConstants.EMAIL_REGEX).required().error((errors) => stringErrorHandler(errors, "Email")),
  password: Joi.string().required().error(errors => stringErrorHandler(errors, 'Password')),
});

