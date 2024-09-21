"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, req, res, next) {
    // Todo - add sentry log here
    console.log("*", error);
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const errors = error.errors;
    const metadata = error.metadata;
    return res
        .status(status)
        .json({
        success: false,
        message,
        error_code: error.errorCode || 'UNKNOWN',
        status_code: status,
        errors,
        metadata,
    });
}
exports.default = errorMiddleware;
//# sourceMappingURL=errorHandlerMiddleware.js.map