
import jwt from 'jsonwebtoken';
import config from '../../config/app'



export const prepareEmailData = (user, action, expiresInMin = 15) => {
  const secretKey = config.jwt.token_secret;
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const expirationTime = now + expiresInMin * 60;
  const payload = {
    user: user._id,
    email: user.email,
    lab: user.lab,
    action: action,
    exp: expirationTime
  }
  // generate JWT token
  const token = jwt.sign(payload, secretKey);

  // include the token in your email data
  const emailData = {
    user_id: user._id,
    first_name: user.first_name,
    email: user.email,
    lab: user.lab,
    token: token,
    exp: expirationTime, // Include the expiration time
  };

  return emailData;
}

export const  prepareForgotPasswordEmailData = (
    emailPreparationData: any,
    subject = "Forgot Password"
  ) =>{
    let email = emailPreparationData.email ? emailPreparationData.email + " " : "";
    let resetURL =
      config.app.ui_app_base_url +
      "/forgot-password/verify?Authorization=" +
      emailPreparationData.token;
  
    const expirationTimeMinutes = Math.floor(
      (emailPreparationData.exp - Date.now() / 1000) / 60
    );
  
    const emailData = {
      first_name: emailPreparationData.first_name,
      email: email,
      subject,
      resetURL,
      expirationTimeMinutes, // Include expiration time in minutes
    };
    // const emailContent = {
    //   email,
    //   first_name: emailPreparationData.first_name,
    //   resetURL,
    //   expirationTimeMinutes, // Include expiration time in minutes
    // };
    return { emailData};
  } 