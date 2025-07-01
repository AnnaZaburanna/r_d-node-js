import { OpenApiGeneratorV3} from '@asteasolutions/zod-to-openapi';
import {config} from "../config/index.js";
import { registry } from '../openapi/registry.js';

export const createZodSpec = () => {
    const zodSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
        info: {
            title: config.appName,
        }
    })

    zodSpec.paths = { ...zodSpec.paths };
    zodSpec.components = {
        ...zodSpec.components,
        schemas: {
            ...zodSpec.components.schemas,
        }
    };

    return zodSpec;
}