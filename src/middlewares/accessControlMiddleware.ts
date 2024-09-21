
import { AuthRequest } from "../interfaces/authRequest";
import { CustomError } from "../interfaces/customError";

export class AccessControlMiddleware {
 

  public async isAllowedToAccessUsers(req: AuthRequest, res, next) {
    try {
      req.locals = req.locals || {};

      const { user_type: userType } = req.user;


      const allowedUserTypes = ["ADMIN"];

      const isUserNotAllowed = !allowedUserTypes.includes(userType);
      

      if (isUserNotAllowed) {
        const err = new CustomError();
        err.status = 403;
        err.errorCode = "FORBIDDEN";
        err.message = "You are Not Allowed to Access Users.";
        throw err;
      }



      return next();
    } catch (err) {
      return next(err);
    }
  }


}
