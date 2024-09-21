import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import Schemas from "./schemas";

export class SchemaValidator {
  public useJoiError: boolean;
  // enabled HTTP methods for request data validation
  private _supportedMethods = ["post", "put", "get", "delete", "patch"];
  private _validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true // remove unknown keys from the validated data
  };

  constructor(useJoiError = false) {
    this.useJoiError = useJoiError;
    // this.validate();
  }

  private getSchema(
    route: string,
    method: string,
    allSchemas: object | any
  ): object | any {
    let _schema: object | any = allSchemas[route];

    if (_schema.multi) {
      _schema = _schema[method];
    }

    if (_schema && _schema.stripUnknown) {
      this._validationOptions.stripUnknown = _schema.stripUnknown;
    }

    return _schema;
  }

  validate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const route: string = req.route.path;
      const method: string = req.method.toLowerCase();

      if (
        !this._supportedMethods.includes(method) ||
        !Schemas ||
        !(Schemas && Schemas[route])
      ) {
        return next();
      }

      const Schema = this.getSchema(route, method, Schemas);

      let data: object | any = req.body;
      if (method === "get") {
        data = Object.assign({}, req.query, req.params);
      }

      if (method === "patch" || method === "delete" || method === "post" || method === "put") {
        data = Object.assign({}, req.body, req.params);
      }

      if (!Schema) {
        return next()
      }

      return Joi.validate(
        data,
        Schema, 
        this._validationOptions,
        (err, result: object | any) => {
          if (err) {
            // Joi Error
            const JoiError = {
              success: false,
              errors: {
                original: err._object,
                // errors: err.details,
                // fetch only message and type from each error
                details: (err.details || []).map(
                  ({ message, type, path, context }) => {
                    return {
                      key: path[0] || context.key,
                      message: message.replace(/['"]/g, ""),
                      type,
                      path: (path && path.join(".")) || context.key
                    };
                  }
                )
              }
            };

            // Custom Error
            const CustomError = {
              status: "failed",
              error:
                "Invalid request data. Please review request and try again."
            };

            // Send back the JSON error response
            return res
              .status(422)
              .json(this.useJoiError ? JoiError : CustomError);
          }

          if (method === "get") {
            req.query = result;
          } else {
            req.body = result;
          }

          return next();
        }
      );
    };
  }
}
