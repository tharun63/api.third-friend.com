import { Request, Response, NextFunction } from 'express';
import GoogleOAuthServiceProvider from '../services/googleOAuthServiceProvider';
import { UserDataServiceProvider} from "../services/database/user";
import { CustomError } from '../interfaces/customError';
import { getUserAuthTokens } from "../helpers/appHelpers";

const userDataServiceProvider = new UserDataServiceProvider();

export class GoogleAuthController {
  public async googleAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const url = GoogleOAuthServiceProvider.generateAuthUrl();
      return res.redirect(url);
    } catch (error) {
      console.error({ error });
      const err = new CustomError();
      err.status = 500;
      err.message = 'Failed to generate Google OAuth URL';
      return next(err);
    }
  }

  public async googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { code } = req.query;
      if (!code) {
        const err = new CustomError();
        err.status = 400;
        err.message = 'No authorization code provided';
        throw err;
      }

      const userInfo = await GoogleOAuthServiceProvider.handleCallback(code as string);
       // Step 2: Check if the user already exists
       let existingUser = await userDataServiceProvider.getUserByEmail(userInfo.email);

       if (!existingUser) {
        // Step 3: If user doesn't exist, create a new one without a password
        const newUser = {
          email: userInfo.email,
          google_id: userInfo.sub, // Google user ID
          first_name: userInfo.given_name,
          last_name: userInfo.family_name,
          password: null, // No password for Google users
          auth_provider: "GOOGLE", // Mark as Google user
        };
  
        // Save the new user in the database
        existingUser = await userDataServiceProvider.saveUserFromGoogle(newUser);

      }

      const { token, refreshToken } = await getUserAuthTokens(existingUser);

      const returnUserData: any = JSON.parse(JSON.stringify(existingUser));
      delete returnUserData.password;

      const respData = {
        success: true,
        user_details: returnUserData,
        access_token: token,
        refresh_token: refreshToken,
        message: "User login success!",
      };


      // You can handle user info here - e.g., saving user data to the database

      return res.status(200).json({
        success: true,
        message: 'Google OAuth login successful',
        data: respData,
      });
    } catch (error) {
      console.error({ error });
      return next(error);
    }
  }
}
