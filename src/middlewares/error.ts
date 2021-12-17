import mongoose  from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import { NextFunction, Request, Response } from 'express';

const ENV = process.env.environment;

export const errorConverter = (err: any, _: Request, __: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];

        error = new ApiError(statusCode, message, err.stack);
    }

    next(error);
};


export const errorHandler = (err: any, _: Request, res: Response, __: NextFunction) => {
    let { statusCode, message } = err;

    if (ENV === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
    };

    res.status(statusCode).send(response);
};