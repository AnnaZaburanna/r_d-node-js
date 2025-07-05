import z from 'zod'
import {ApiProperty} from "@nestjs/swagger";
export const TeaSchema = z.object({
    name: z.string().min(3).max(40),
    origin: z.string().min(2).max(30),
    rating: z.number().min(1).max(10).optional(),
    brewTemp: z.number().min(60).max(100).optional(),
    notes: z.string().max(150).optional(),
});
export const CreateTeaDto = TeaSchema;
export const UpdateTeaDto = TeaSchema.partial();

export class SwaggerCreateTeaDto {
    @ApiProperty({ minLength: 3, maxLength: 40 })
    name: string;

    @ApiProperty({ minLength: 2, maxLength: 30 })
    origin: string;

    @ApiProperty({ minimum: 1, maximum: 10, required: false })
    rating?: number;

    @ApiProperty({ minimum: 60, maximum: 100, required: false })
    brewTemp?: number;

    @ApiProperty({ maxLength: 150, required: false })
    notes?: string;
}
export class SwaggerUpdateTeaDto {
    @ApiProperty({ minLength: 3, maxLength: 40, required: false })
    name?: string;

    @ApiProperty({ minLength: 2, maxLength: 30, required: false })
    origin?: string;

    @ApiProperty({ minimum: 1, maximum: 10, required: false })
    rating?: number;

    @ApiProperty({ minimum: 60, maximum: 100, required: false })
    brewTemp?: number;

    @ApiProperty({ maxLength: 150, required: false })
    notes?: string;
}