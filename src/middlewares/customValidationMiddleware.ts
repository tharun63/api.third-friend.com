import { Request, Response, NextFunction, query } from "express";
// data service provider
import { UserDataServiceProvider} from "../services/database/user";

import { AuthRequest } from "./../interfaces/authRequest";
import { CustomError } from "../interfaces/customError";


const userDataServiceProvider = new UserDataServiceProvider();




export class CustomValidationMiddleware {
 
  public async checkEmailExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const exists = await userDataServiceProvider.emailExists(req.body.email);
      if (exists) {
        return res.status(403).json({
          success: false,
          message: "Account with this email is already taken",
          statusCode: 403,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  public async checkUserNameExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const exists = await userDataServiceProvider.userNameExists(
        req.body.username
      );
      if (exists) {
        const err = new CustomError();
        err.message = "Account with this username is already taken";
        err.status = 403;
        err.errorCode = "USER_NAME_ALREADY_TAKEN";
        throw err;
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }

  
  public async checkCurrentPasswordIsCorrect(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let user = await userDataServiceProvider.login(
        req.user.email,
        req.body.current_password
      );
      if (!user) {
        return res.status(403).json({
          success: false,
          message:
            "Invalid username or current password. Please check and enter the details again.",
          statusCode: 403,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  public  parseSkipAndLimitAndSortParams(
    request: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    let { page = 1, limit = 10 } = request.query;
    const {
      order_by: orderBy,
      order_type: orderType,
      get_all: getAll,
    } = request.query;

    let skip = 0;
    const sort = {};

    if (getAll) {
      limit = null;
      skip = null;
    } else if (page && limit) {
      skip = (page - 1) * limit;
    }

    if (orderBy) {

      sort[`${orderBy}`] = orderType === "desc" ? -1 : 1;
    }
    limit = parseInt(limit, 0);
    request.parsedFilterParams = {
      skip,
      limit,
      query: {},
      sort,
      projection: {},
    };
    return next();
  }

  public parseStatusIntoParse(
    request: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const status = request.query.status;
    if (!status) {
      return next();
    }

    request.parsedFilterParams = request.parsedFilterParams || {
      skip: null,
      limit: null,
      query: {},
      sort: {},
      projection: {},
    };

    if (Array.isArray(status) && status.length) {
      request.parsedFilterParams.query.status = {
        $in: status,
      };
    } else {
      request.parsedFilterParams.query.status = status;
    }

    return next();
  }

  public searchByName(request: AuthRequest, res: Response, next: NextFunction) {
    const { search_string: searchString } = request.query;
    if (!searchString || !searchString.length) {
      return next();
    }

    const searchPattern = new RegExp(searchString, "i");

    request.parsedFilterParams = request.parsedFilterParams || {
      skip: null,
      limit: null,
      query: {},
      sort: {},
      projection: {},
    };

    return next();
  }

  public searchByFirstAndLastName(
    request: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { search_string: searchString } = request.query;
    if (!searchString) {
      return next();
    }

    const searchPattern = new RegExp(searchString, "i");

    request.parsedFilterParams = request.parsedFilterParams || {
      skip: null,
      limit: null,
      query: {},
      sort: {},
      projection: {},
    };
    request.parsedFilterParams.query.first_name = searchPattern;
    request.parsedFilterParams.query.last_name = searchPattern;

    return next();
  }

  public searchByUserNameOrEmailOrName(
    request: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { search_string: searchString } = request.query;
    if (!searchString) {
      return next();
    }

    const searchPattern = new RegExp(searchString, "i");

    request.parsedFilterParams = request.parsedFilterParams || {
      skip: null,
      limit: null,
      query: {},
      sort: {},
      projection: {},
    };

    request.parsedFilterParams.query.$or = [
      {
        first_name: searchPattern,
      },
      {
        middle_name: searchPattern,
      },
      {
        last_name: searchPattern,
      },
      {
        email: searchPattern,
      },
      {
        username: searchPattern,
      },
      {
        name: searchPattern,
      },
      {
        firm_name: searchPattern,
      },
    ];

    return next();
  }

}
