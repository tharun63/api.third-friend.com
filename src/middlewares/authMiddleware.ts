import jwt from "jsonwebtoken";
import { UserDataServiceProvider } from "../services/database/user";
import config from "../../config/app";
const userDataServiceProvider = new UserDataServiceProvider();

import { UserInterface} from "../interfaces/user";
import { AuthRequest } from "../interfaces/authRequest";
import { Request, Response, NextFunction } from "express";

import { CustomError, CustomErrorInterface } from "../interfaces/customError";
import { verifyToken } from "../helpers/verifyTokenHelper";


export class AuthMiddleware {
  checkAuthHeader(req, res, next) {
    const userIdleTime = req.headers["user-idle-time-in-min"];

    if (
      userIdleTime &&
      (parseInt(userIdleTime) > config.app.auto_logout_in_min ||
        userIdleTime == -1)
    ) {
      const respData = {
        success: false,
        message: "Session Timeout",
        errCode: "SESSION_TIMEOUT",
      };
      return res.status(401).json(respData);
    }

    if (!req.headers.authorization) {
      const respData = {
        success: false,
        message: "No Authorization Token",
      };
      return res.status(403).json(respData);
    }
    next();
  }

  public async validateAccessToken(req, res, next) {
    try {
      
      const accessToken = req.headers.authorization || req.body.authorization;

      // Decode JWT received via Header
      const userDetails = jwt.decode(accessToken);

      // Fetch User From DB
      const user: any = await userDataServiceProvider.userById(userDetails.id);

      const tokenSecret = config.jwt.token_secret + user.password;

      try {
        // Verify JWT
        jwt.verify(accessToken, tokenSecret);

        // Add User to the Request Payload


        req.user = user;

        next();
      } catch (error) {
        let respData = {
          success: false,
          message: error.message,
          error: error,
        };
        return res.status(401).json(respData);
      }
    } catch (error) {
      let respData = {
        success: false,
        message: "Invalid Access Token",
      };
      return res.status(401).json(respData);
    }
  }

  public async checkUserStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const user: UserInterface = req.user;
      if (user.user_status === "ACTIVE") {
        return next();
      }

      const err: CustomErrorInterface = new CustomError();

      if (user.user_status === "ARCHIVED") {
        err.status = 401;
        err.message = "UnAuthorized.Invalid Credentials.";
        err.errorCode = "UNAUTHORIZED";
        throw err;
      }
      err.status = 403;
      err.message = `Forbidden.You Account is on ${user.user_status} status.`;
      err.errorCode = "FORBIDDEN";
      throw err;
    } catch (err) {
      return next(err);
    }
  }



  public async checkUserByEmail(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email = req.body.email;
      const user = await userDataServiceProvider.getUserByEmail(email);

      if (!user) {
        throw new CustomError(409, "Invalid Username");
      }
      req.user = user;
      return next();
    } catch (err) {
      next(err);
    }
  }

  // public async checkUserByEmail(
  //   req: AuthRequest,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const email = req.body.email;
  //     const user = await userDataServiceProvider.getUserByEmail(email);

  //     if (!user) {
  //       throw new CustomError(409, "Invalid Email");
  //     }
  //     req.user = user;
  //     return next();
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  public async verifyUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.query.authorization;

      if (!token) {
        throw new CustomError(401, "Token missing");
      }

      const verifyJWT = verifyToken(token);

      if (!verifyJWT || verifyJWT == null) {
        throw new CustomError(409, "Invalid Token");
      }

      const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds

      if (verifyJWT.exp && now > verifyJWT.exp) {
        throw new CustomError(401, "Token has expired");
      }


      let userId = verifyJWT.user;
      const user = await userDataServiceProvider.userById(userId);
      if (!user) {
        throw new CustomError(409, "Link has been expired");
      }
      req.user = user;
      return next();
    }
    catch (err) {
      next(err)
    }
  }

}


export default new AuthMiddleware();
