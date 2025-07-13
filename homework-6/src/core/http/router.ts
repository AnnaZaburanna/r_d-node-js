import express from 'express';
import {Type} from "../types";
import {container} from "../container";
import {asyncHandler} from "./async.handler";
import {HandlerMiddleware} from "./handler.middleware";
import {GuardsMiddleware} from "./guards.middleware";
import {FiltersMiddleware} from "./filters.middleware";

export function Factory(modules: any[]) {

    const app = express();

    app.use(express.json());

    const router = express.Router();
    const globalGuards: Array<Type> = [];
    const globalPipes: Array<Type>  = [];
    const globalFilters: Array<Type>  = [];

    const listen = (port: number, callback?: () => void) => {
        const allModules = resolveModulesRecursively(modules);
        for (const mod of allModules) {
            const meta = Reflect.getMetadata('mini:module', mod);
            if (!meta) continue;

            for (const Ctl of meta.controllers ?? []) {
                container.register(Ctl, Ctl)
                const prefix = Reflect.getMetadata('mini:prefix', Ctl) ?? '';
                const routes = Reflect.getMetadata('mini:routes', Ctl) ?? [];

                const instance = container.resolve(Ctl) as InstanceType<typeof Ctl>;

                routes.forEach((r: any) => {
                    const handler = instance[r.handlerName] as (...args: any[]) => Promise<any>;

                    const path = prefix + r.path;

                    (router as any)[r.method](
                        path,
                        asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
                        asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
                        asyncHandler(FiltersMiddleware(Ctl, handler, globalFilters)),
                    );
                });
            }
        }

        app.listen(port, callback);
    }
    app.use(router);

    return {
        get: container.resolve,
        listen,
        use: (path: string, handler: express.RequestHandler) => {
            app.use(path, handler);
        },
        useGlobalGuards: (guards: any[]) => {
            globalGuards.push(...guards);
        },
        useGlobalPipes: (pipes: any[]) => {
            globalPipes.push(...pipes);
        },
        useGlobalFilters: (filters: any[]) => {
            globalFilters.push(...filters);
        },
    }
}

export const initModule = async (moduleClass: any) => {
    const metadata = Reflect.getMetadata('mini:module', moduleClass);
    if (!metadata) {
        throw new Error(`Module ${moduleClass.name} does not exist`);
    }

    const { providers = [], controllers = [], imports = [] } = metadata;

    for (const importedModule of imports) {
        await initModule(importedModule);
    }

    for (const provider of providers) {
        container.register(provider, provider);
    }

    for (const controller of controllers) {
        container.register(controller, controller);
    }
}

function resolveModulesRecursively(modules: any[], collected = new Set<any>()) {
    for (const mod of modules) {
        if (collected.has(mod)) continue;
        collected.add(mod);

        const meta = Reflect.getMetadata('mini:module', mod);
        if (!meta) continue;

        resolveModulesRecursively(meta.imports ?? [], collected);
    }
    return [...collected];
}