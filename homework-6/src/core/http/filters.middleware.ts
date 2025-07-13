import {Type} from "../types";
import {ErrorRequestHandler} from "express";

export const FiltersMiddleware = (Ctl: Type, handler: Function, filters: Array<Type>): ErrorRequestHandler => {
    return (err, req, res, _next) => {
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Internal Server Error';

        res.status(status).json({
            statusCode: status,
            message,
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
        });
    };
}