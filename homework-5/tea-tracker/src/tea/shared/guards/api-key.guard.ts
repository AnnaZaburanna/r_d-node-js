import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

@Injectable()

export class ApiKeyGuard implements CanActivate {
    private readonly key = 'im_rd_student'

    constructor(private reflector:Reflector) {}

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getClass(), context.getHandler()
        ])

        if(isPublic) return true

        const { headers } = context.switchToHttp().getRequest();

        if(headers['x-api-key'] !== this.key) {
            throw new ForbiddenException('Invalid API key')
        }

        return true;
    }
}