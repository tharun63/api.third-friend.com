"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const schemas_1 = __importDefault(require("./schemas"));
class SchemaValidator {
    constructor(useJoiError = false) {
        // enabled HTTP methods for request data validation
        this._supportedMethods = ["post", "put", "get", "delete", "patch"];
        this._validationOptions = {
            abortEarly: false, // abort after the last validation error
            allowUnknown: true, // allow unknown keys that will be ignored
            stripUnknown: true // remove unknown keys from the validated data
        };
        this.useJoiError = useJoiError;
        // this.validate();
    }
    getSchema(route, method, allSchemas) {
        let _schema = allSchemas[route];
        if (_schema.multi) {
            _schema = _schema[method];
        }
        if (_schema && _schema.stripUnknown) {
            this._validationOptions.stripUnknown = _schema.stripUnknown;
        }
        return _schema;
    }
    validate() {
        return (req, res, next) => {
            const route = req.route.path;
            const method = req.method.toLowerCase();
            if (!this._supportedMethods.includes(method) ||
                !schemas_1.default ||
                !(schemas_1.default && schemas_1.default[route])) {
                return next();
            }
            const Schema = this.getSchema(route, method, schemas_1.default);
            let data = req.body;
            if (method === "get") {
                data = Object.assign({}, req.query, req.params);
            }
            if (method === "patch" || method === "delete" || method === "post" || method === "put") {
                data = Object.assign({}, req.body, req.params);
            }
            if (!Schema) {
                return next();
            }
            return joi_1.default.validate(data, Schema, this._validationOptions, (err, result) => {
                if (err) {
                    // Joi Error
                    const JoiError = {
                        success: false,
                        errors: {
                            original: err._object,
                            // errors: err.details,
                            // fetch only message and type from each error
                            details: (err.details || []).map(({ message, type, path, context }) => {
                                return {
                                    key: path[0] || context.key,
                                    message: message.replace(/['"]/g, ""),
                                    type,
                                    path: (path && path.join(".")) || context.key
                                };
                            })
                        }
                    };
                    // Custom Error
                    const CustomError = {
                        status: "failed",
                        error: "Invalid request data. Please review request and try again."
                    };
                    // Send back the JSON error response
                    return res
                        .status(422)
                        .json(this.useJoiError ? JoiError : CustomError);
                }
                if (method === "get") {
                    req.query = result;
                }
                else {
                    req.body = result;
                }
                return next();
            });
        };
    }
}
exports.SchemaValidator = SchemaValidator;
//# sourceMappingURL=schemaValidator.js.map