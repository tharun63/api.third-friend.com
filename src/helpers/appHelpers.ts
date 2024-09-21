
import config from "../../config/app";
import jwt from "jsonwebtoken";


export const generateToken = function (maxlength = 32) {
  var token = "";

  for (let i = 0; i < 4; i++) {
    token += Math.random().toString(36).substring(2, 15);
  }

  return token.substring(0, maxlength);
};



export const getUserAuthTokens = function (userData) {
  let user = {
    id: userData._id,
    email: userData.email,
    user_type: userData.user_type,
    first_name: userData.first_name,
    last_name: userData.last_name,
  };

  let tokenSecret = config.jwt.token_secret + (userData.auth_provider === 'GOOGLE' ? userData.google_id : userData.password);
  let refreshTokenSecret = config.jwt.refresh_token_secret +  (userData.auth_provider === 'GOOGLE' ? userData.google_id : userData.password);

  const token = jwt.sign(user, tokenSecret, {
    expiresIn: config.jwt.token_life,
  });

  const refreshToken = jwt.sign(user, refreshTokenSecret, {
    expiresIn: config.jwt.refresh_token_life,
  });
  return {
    token,
    refreshToken,
  };

  
};

export const mapOrderItemsToStripeFormat = function(bill_items: any[]) {

  return bill_items.map(item => ({

      price_data: {

          currency: 'inr',

          product_data: {
              name: item.accession_id,
          },

          unit_amount: item.payment_amount * 100
      },

      quantity: 1,
  }));
}
