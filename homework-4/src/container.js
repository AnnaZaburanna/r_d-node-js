import {asClass, createContainer} from "awilix";
import {BrewsModel} from "./models/brews.model.js";
import {BrewsService} from "./services/brews.service.js";
import {BrewsController} from "./controllers/brews.controller.js";

const brewsModule = {
    brewsModel: BrewsModel,
    brewsService: BrewsService,
    brewsController: BrewsController
}

export const objectMap = (obj, fn) => {
    if (typeof obj !== 'object' || obj === null) {
        throw new TypeError('Expected an object');
    }
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = fn(value, key, obj);
        return acc;
    }, {});
}
export const container = createContainer({injectionMode: 'CLASSIC'})
    .register(objectMap(brewsModule, value => asClass(value)[value.scope]().disposer(instance => {
            if (typeof instance?.dispose === 'function') {
                return instance.dispose();
            }
        })
    )
);


