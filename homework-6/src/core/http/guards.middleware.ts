import {Type} from "../types";
import {runGuards} from "../decorators";
import {Request, Response, NextFunction } from 'express'
import {ForbiddenException} from "./http-exception";

export const GuardsMiddleware = (Ctl: Type, handler: Function, globalGuards: Array<Type> = []) => async (req: Request, res: Response, next: NextFunction) => {
    const guardResult = await runGuards(Ctl, handler, req, res, globalGuards);
    if (typeof guardResult !== 'string') {
        return next();
    }
    throw new ForbiddenException(`Forbidden by ${guardResult}`)
}