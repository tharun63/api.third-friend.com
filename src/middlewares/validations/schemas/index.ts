import { signUpDataSchema } from "./users/signup";
import { signInDataSchema } from "./users/signin";
import { forgotPasswordDataSchema } from "./users/forgotPassword";
import { forgotPasswordVerifyHeadersSchema } from "./users/forgotPasswordVerify";
import { updateProfileDataSchema } from "./users/updateProfile";
import {addJourneyDataSchema,updateJourneyDataSchema} from "./journeys/addJourney";
import { resetPasswordSchema } from "./users/resetPassword";
import { addOrderDataSchema,updateOrderDataSchema } from "./orders/addOrder";

// import { updatePasswordDataSchema } from "./users/updatePassword";


export default {
  "/signup": signUpDataSchema,
  "/signin": signInDataSchema, 
  "/profile": updateProfileDataSchema,
//   "/password/update": updatePasswordDataSchema,
//   /* Forgot password */
 "/forgot-password": forgotPasswordDataSchema,
 "/forgot-passowrd/verify": forgotPasswordVerifyHeadersSchema,
  /* reset password */
 "/reset-password": resetPasswordSchema,
 "/order":addOrderDataSchema,

  "/journey":{
    multi:true,
    post:addJourneyDataSchema,
    patch:updateJourneyDataSchema
  }
};
