import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";

@Catch()
export class PgExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        if (exception instanceof HttpException) {
            return res.status(exception.getStatus()).json(exception.getResponse());
        }

        if (exception?.code === '23514') {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'CHECK violation' });
        }
        if (exception?.code === '23503') {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'FK violation' });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal error' });
    }
}