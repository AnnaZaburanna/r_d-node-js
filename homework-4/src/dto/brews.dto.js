import { z } from 'zod';
import { registry } from '../openapi/registry.js';

export const CoffeeMethodEnum = z.enum(['v60', 'aeropress', 'chemex', 'espresso']);

export const BrewsDto = z.object({
    beans: z.string().min(3).max(40),
    method: CoffeeMethodEnum,
    rating: z.number().min(1).max(5).optional(),
    notes: z.string().max(200).optional(),
    brewed_at: z.string() .datetime({ offset: true })
        .optional()
        .default(() => new Date().toISOString()),
})

registry.register('Brew', BrewsDto);