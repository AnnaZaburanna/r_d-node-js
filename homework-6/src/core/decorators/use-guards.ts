import {Type} from "../types";
import {container} from "../container";
import {ExpressExecutionContext} from "../utils";
import type { Request, Response } from 'express';


export const GUARDS_METADATA = Symbol('guards');

export function UseGuards( ...guards: Function[] ): ClassDecorator & MethodDecorator {
    return (target: any, key?: string | symbol) => {
        if(key) {
            Reflect.defineMetadata(GUARDS_METADATA, guards, target[key])
        } else {
            Reflect.defineMetadata(GUARDS_METADATA, guards, target);
        }
    }
}

export function getGuards (handler: Function, controllerClass:  Function, globalGuards: Array<Type> = []) {
    const controllerGuards = Reflect.getMetadata(GUARDS_METADATA, controllerClass) ?? [];
    const routeGuards =  Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];

    globalGuards.push(
        ...controllerGuards,
        ...routeGuards
    );

    return globalGuards;
}

export async function runGuards(
    controllerClass: Function,
    handler: Function,
    req: Request,
    res: Response,
    globalGuards: Array<Type> = []): Promise<boolean | string> {

    const guards = getGuards(handler, controllerClass, globalGuards);

    for (const GuardCtor of guards) {
        const guardInstance = container.resolve<any>(GuardCtor);

        const ctx = new ExpressExecutionContext(controllerClass, handler, req, res);
        const can = await Promise.resolve(guardInstance.canActivate(ctx) );
        console.log({can, GuardCtor})
        if (!can) return GuardCtor.name;
    }
    return true;
}