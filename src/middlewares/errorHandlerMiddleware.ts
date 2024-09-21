import { NextFunction, Request, Response } from 'express';
import { CustomErrorInterface } from '../interfaces/customError'

function errorMiddleware(error: CustomErrorInterface, req: Request, res: Response, next: NextFunction) {
    // Todo - add sentry log here
    console.log("*", error)
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const errors = error.errors
    const metadata = error.metadata
    return res
        .status(status)
        .json({
            success: false,
            message,
            error_code: error.errorCode || 'UNKNOWN',
            status_code: status,
            errors,
            metadata,
        })
}

export default errorMiddleware;