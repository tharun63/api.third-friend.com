"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(status, message, errorCode, errors, metadata) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
        this.errors = errors;
        this.metadata = metadata;
    }
    setStatusCode(statusCode) {
        this.status = statusCode;
    }
    setErrorCode(errorCode) {
        this.errorCode = errorCode;
    }
    setMessage(message) {
        this.message = message;
    }
    setMetadata(data) {
        this.metadata = data;
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=customError.js.map