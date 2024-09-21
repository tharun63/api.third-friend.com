import dotenv from "dotenv";

// load the correct env file based on the NODE_ENV value passed during the npm command
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// set up data
const appData = {
  port: process.env.PORT,
  api_version: process.env.API_VERSION,
  auto_logout_in_min: 30,
  ui_app_base_url: process.env.APP_URL,
  password_expire_in_days: process.env.PASSWORD_EXPIRE_IN_DAYS || 90,


};

const DB = {
  mongo_connection_string: process.env.MONGO_CONNECTION_STRING,
};


const GOOGLE_API = {
  google_client_id: process.env.CLIENT_ID,
  google_client_secret: process.env.CLIENT_SECRET,
  google_redirect_uri: process.env.REDIRECT_URI
};

const EMAIL_SERVICE = {
  email_service: process.env.EMAIL_SERVICE,
  user: process.env.GMAIL_USER,
  pass: process.env.GMAIL_PASSKEY
}

const STRIPE = {
  secret_key: process.env.STRIPE_SECRET_KEY,
  web_hook_key: process.env.STRIPE_WEB_HOOK_KEY,
};


// load different jwt secrets based on the NODE_ENV value passed during the npm command
const env = process.env.NODE_ENV;
var JWTData = null;


switch (env) {
  case "dev":
    JWTData = {
      token_secret: process.env.DEV_TOKEN_SECRET,
      token_life: process.env.DEV_TOKEN_LIFE, 
      refresh_token_secret: process.env.DEV_REFRESH_TOKEN_SECRET,
      refresh_token_life: process.env.DEV_REFRESH_TOKEN_LIFE, 
    };

    break;

  case "prod":
    JWTData = {
      token_secret: process.env.TOKEN_SECRET,
      token_life: process.env.TOKEN_LIFE, 
      refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
      refresh_token_life: process.env.REFRESH_TOKEN_LIFE,
    };

 
    break;
}

const configData = {
  app: appData,
  db: DB,
  jwt: JWTData,
  google: GOOGLE_API,
  payments:{
    stripe:STRIPE
  },
  email:EMAIL_SERVICE

};
export default configData;
