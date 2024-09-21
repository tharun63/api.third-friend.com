// users/forgotPasswordVerify.ts

import Joi from "joi";

// Define schema for the headers (e.g., expecting an Authorization token in headers)
export const forgotPasswordVerifyHeadersSchema = Joi.object({
  authorization: Joi.string().required().description('JWT Authorization token'),
}).unknown(); // 'unknown()' allows other headers to pass through without validation
