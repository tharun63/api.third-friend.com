import { Request, Response, NextFunction, response } from "express";
import { UserDataServiceProvider} from "../services/database/user";
import { getUserAuthTokens } from "../helpers/appHelpers";
import { CustomError } from "../interfaces/customError";
import filtersHelper from "../helpers/filterHelper";
import paginationHelper from "../helpers/paginationHelpers";
import EmailServiceProvider from "../services/notifications/emailServiceProvider";
import moment from "moment";

// interfaces
import { AuthRequest } from "../interfaces/authRequest";

import appConfig from "../../config/app";
import { prepareEmailData, prepareForgotPasswordEmailData } from "../helpers/messageHelper";


const userDataServiceProvider = new UserDataServiceProvider();

export class UserController {
  public async signIn(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { token, refreshToken } = await getUserAuthTokens(req.user);

      const returnUserData: any = JSON.parse(JSON.stringify(req.user));
      delete returnUserData.password;

      const respData = {
        success: true,
        user_details: returnUserData,
        access_token: token,
        refresh_token: refreshToken,
        message: "User login success!",
      };
      return res.status(201).json(respData);
    } catch (error) {
      console.log({ error });
      return next(error);
    }
  }

  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      console.log({userData})
      
      await userDataServiceProvider.saveUser(userData);
      return res.status(201).json({
        success: true,
        message: "User Registered  Successfully!",
      });
    } catch (err) {
      next(err);
    }
  }

  public async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let advertiserDetails: any = await userDataServiceProvider.userById(
        req.user._id,
        true
      );
      const profile = {
        first_name: advertiserDetails.first_name,
        last_name: advertiserDetails.last_name,
        email: advertiserDetails.email,
        phone: advertiserDetails.phone,
        username: advertiserDetails.username,
        address: advertiserDetails.address,
        user_type: advertiserDetails.user_type
      };

      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: profile,
      });
    } catch (error) {
      let respData = {
        success: false,
        message: error.message,
      };

      return res.status(error.statusCode || 500).json(respData);
    }
  }

  public async forgotPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let user = req.user;


      // //prepare email link data for send email
      let emailPreparationData = prepareEmailData(user, "FORGOT_PASSWORD");
      // sending mail to user
      const { emailData } = prepareForgotPasswordEmailData(
        emailPreparationData
      );
      await EmailServiceProvider.sendForgotPasswordEmail(
        emailData
      );
      return res.status(200).json({
        success: true,
        message: `Forgot Password Link sent to ${user.email} successfully. Please note that the Link will expire in 15 minutes`,
      });
    } catch (err) {
      next(err);
    }
  }

  public async verifyForgotPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(req.headers)
      return res.status(200).json({
        success: true,
        message: `User verified successfully`,
      });
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { password, confirm_password } = req.body;
      let userId = req.user._id;
      const passwordExpiredAt = moment()
        .add(appConfig.app.password_expire_in_days, "days")
        .utc()
        .format();
      await userDataServiceProvider.updatePassword(
        userId,
        password,
        passwordExpiredAt
      );
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    }
    catch (err) {
      next(err)
    }
  }


  public async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let profile = req.body;
      if (profile.user_code) {
        delete profile.user_code;
      }
      if (profile.avatar) {
        delete profile.avatar;
      }
      await userDataServiceProvider.updateUserById(req.user._id, profile);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    } catch (error) {
      let respData = {
        success: false,
        message: error.message,
      };
      return res.status(error.statusCode || 500).json(respData);
    }
  }

  public async updatePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
    //   const passwordExpiredAt = moment()
    //     .add(appConfig.app.password_expire_in_days, "days")
    //     .utc()
    //     .format();
      await userDataServiceProvider.updatePassword(
        req.user._id,
        req.body.new_password,
        // passwordExpiredAt
      );
      let respData = {
        success: true,
        message: "Password Updated Successfully",
      };
      return res.status(201).json(respData);
    } catch (error) {
      return next(error);
    }
  }

 

  public async AddUser(req: Request, res: Response, next: NextFunction) {
    try {

      const userData = req.body;
      const requestedUser: any = req.user;

      userData.username = userData.username.toLowerCase();
      const exists = await userDataServiceProvider.userNameExists(
        userData.username
      );

      if (exists) {
        const err = new CustomError();
        err.status = 409;
        err.message = "Account with this username is already taken";
        throw err;
      }
     
      userData.password = "123456";
     
     

      let savedUser: any = await userDataServiceProvider.saveUser(userData);

    
      const addedUserName = savedUser.first_name + " " + savedUser.last_name;
      const role = savedUser.user_type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return res.status(201).json({
        success: true,
        message: "User Registered  Successfully!",
        data: savedUser
      });
    } catch (err) {
      next(err);
    }
  }


  public async getUserById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const removePassword = true;
      let data = await userDataServiceProvider.userById(
        req.params.id,
        removePassword
      );

      return res.status(200).json({
        success: true,
        message: "User Account data fetched successfully",
        data: data,
      });
    } catch (error) {
      return next(error);
    }
  }


  public async getAllUsers(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      let { skip, limit, sort, projection } = req.parsedFilterParams;
      let { query = {} } = req.parsedFilterParams;

      

      query = filtersHelper.users(query, req.query);
      sort.updated_at = -1;

      projection = {
        first_name: 1,
        last_name: 1,
        status: 1,
        username: 1,
        user_type: 1,
      };

      const [users = [], count = 0] = await Promise.all([
        userDataServiceProvider.getAllUsers({ query, skip, limit, sort, projection, }),
        userDataServiceProvider.countAllUsers(query),
      ]);

      const response = paginationHelper.getPaginationResponse({
        page: req.query.page || 1,
        count,
        limit,
        skip,
        data: users,
        message: "All User Detail fetched successfully",
        searchString: req.query.search_string,
      });

      return res.json(response);
    } catch (err) {
      return err;
    }
  }
  
}
