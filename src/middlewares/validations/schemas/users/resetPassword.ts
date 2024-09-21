

import Joi from 'joi'
export const resetPasswordSchema = Joi.object().keys({
    password: Joi.string().min(6).required().strict().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
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

    confirm_password: Joi.string().required().valid(Joi.ref('password')).error(errors => {
        errors.forEach(err => {
            switch (err.type) {
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