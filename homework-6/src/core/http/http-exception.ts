export class HttpException extends Error {
    constructor(
        public readonly status: number | string,
        public readonly message: string
    ) {
        super(message);
    }
}


export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}


export class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}


export class NotFoundException extends HttpException {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}


export class InternalServerErrorException extends HttpException {
    constructor(message = 'Internal Server Error') {
        super(500, message);
    }
}