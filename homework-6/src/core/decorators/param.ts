import {ArgumentMetadata} from "../types";
import {PipeTransform} from "./use-pipes";

export function Param(data?: string, ...paramPipes: PipeTransform[]) {
    return function (target: any, name: string, index: number) {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, name) ?? [];

        const metatype = paramTypes[index]

        const params: Array<ArgumentMetadata> =
            Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({index, metatype, type: 'param', data, name, pipes: paramPipes});
        Reflect.defineMetadata('mini:params', params, target.constructor);
    }
}

export function Query(data: string) {
    return function (target: any, name: string, index: number) {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        const metatype = paramTypes[index];
        const params: Array<ArgumentMetadata> =
            Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({ index, type: 'query', metatype, data, name });
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}

export function Body(...paramPipes: PipeTransform[]) {
    return function (target: any, name: string, index: number) {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, name) ?? [];

        const metatype = paramTypes[index];
        const params: Array<ArgumentMetadata> =
            Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({ index, type: 'body', metatype, name, pipes: paramPipes });
        Reflect.defineMetadata('mini:params', params, target.constructor);
    }
}