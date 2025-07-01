import {Router} from "express";
import {makeClassInvoker} from "awilix-express";
import {BrewsController} from "../controllers/brews.controller.js";
import {z} from 'zod';
import { registry } from '../openapi/registry.js';
import {BrewsDto, CoffeeMethodEnum} from "../dto/brews.dto.js";
import {validateParams} from "../middlewares/validateParams.js";
import {validate} from "../middlewares/validate.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";


const router = Router();
const ctl = makeClassInvoker(BrewsController);

const paramsSchema = z.object({
    id: z.string().describe('Brew id')
})

router.get('/brews', ctl("index"));
registry.registerPath({
    method: 'get',
    path: '/api/brews',
    tags: ['Brews'],
    request: {
        query: z.object({
            method: CoffeeMethodEnum.optional(),
            ratingMin: z.coerce.number().min(1).max(5).optional()
        }),
    },
    responses: {
        200: {
            description: 'List of brews',
            content: {'application/json': {schema: z.array(BrewsDto)}}
        }
    }
})

router.get( '/brews/:id',   validateParams(paramsSchema),
    ctl("show"));
registry.registerPath({
    method: 'get',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {params: paramsSchema},
    responses: {
        200: {description: 'Brew', content: {'application/json': {schema: BrewsDto}}},
        404: {description: 'Brew not found'}
    }
})

router.post(
    '/brews',
    validate(BrewsDto),
    asyncHandler(ctl('create'))
);
registry.registerPath({
    method: 'post',
    path: '/api/brews',
    tags: ['Brews'],
    request: {
        body: {required: true, content: {'application/json': {schema: BrewsDto}}}
    },
    responses: {
        201: {description: 'Created', content: {'application/json': {schema: BrewsDto}}},
        400: {description: 'Validation error'}
    }
})

router.put(
    '/brews/:id',
    validateParams(paramsSchema),
    validate(BrewsDto),
    asyncHandler(ctl('update'))
);
registry.registerPath({
    method: 'put',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {
        params: paramsSchema,
        body: {required: true, content: {'application/json': {schema: BrewsDto}}}
    },
    responses: {
        200: {description: 'Updated brew', content: {'application/json': {schema: BrewsDto}}},
        400: {description: 'Validation error'},
        404: {description: 'Brew not found'}
    }
})

router.delete(
    '/brews/:id',
    asyncHandler(ctl('remove'))
);
registry.registerPath({
    method: 'delete',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {params: paramsSchema},
    responses: {
        204: {description: 'Deleted'},
        404: {description: 'Brew not found'}
    }
})

export {router}