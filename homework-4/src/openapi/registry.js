import {extendZodWithOpenApi, OpenAPIRegistry} from "@asteasolutions/zod-to-openapi";
import {z} from 'zod';

extendZodWithOpenApi(z);
globalThis.registry ??= new OpenAPIRegistry();

export const registry = globalThis.registry;