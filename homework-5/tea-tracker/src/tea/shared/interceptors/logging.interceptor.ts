import {CallHandler, ExecutionContext, Injectable, LoggerService, NestInterceptor} from "@nestjs/common";
import {tap} from "rxjs";

@Injectable()

export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const now = Date.now();

        return next.handle().pipe(tap(() =>
            this.logger.log(`Handled in ${Date.now() - now}ms`)
        ))
    }
}