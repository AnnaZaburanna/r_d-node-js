import { Request } from 'express';


export type ParamType = 'body' | 'query' | 'param' | 'header' | 'cookie';

export const extractParams = (Req: Request, type: ParamType) => {
    switch (type) {
        case 'body':
            return Req.body;
        case 'query':
            return Req.query;
        case 'param':
            return Req.params;
        case 'header':
            return Req.headers;
        case 'cookie':
            return Req.cookies;
        default:
            throw new Error(`Unknown param type: ${type}`);
    }
}