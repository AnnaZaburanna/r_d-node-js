import {BadRequestException, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {ZodSchema} from "zod";

export const Zbody = (schema: ZodSchema) => createParamDecorator(async(data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    try {
        return await schema.parseAsync(req.body)
    } catch (e) {
        throw new BadRequestException(e.errors)
    }
})();