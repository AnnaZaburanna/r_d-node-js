import {ArgumentMetadata, Type} from "../types";
import {container} from "../container";
import {isClass} from "../utils";

export interface PipeTransform<T = any, R = any> {
    transform(value: T, metadata: ArgumentMetadata): R | Promise<R>
}

export const PIPES_METADATA = Symbol('pipes');

type PipesType = Type<PipeTransform> | InstanceType<Type<PipeTransform>>;

export function UsePipes(...pipes: PipesType[]): ClassDecorator & MethodDecorator {
    return (target: any, key?: string | symbol) => {
        const where = key ? target[key] : target

        Reflect.defineMetadata(PIPES_METADATA, pipes, where);
    }
}

export function getPipes(
    handler: Function,
    controller: Function,
    paramIndex: number,
    globalPipes: PipesType[] = [],
    ): PipesType[]  {
    const classPipes = Reflect.getMetadata(PIPES_METADATA, controller) ?? [];
    const methodPipes = Reflect.getMetadata(PIPES_METADATA, handler) ?? [];

    const paramMeta: Array<ArgumentMetadata> = Reflect.getMetadata('mini:params', controller) ?? [];
    const paramPipeEntry = paramMeta.find(m => m.index === paramIndex && m.name === handler.name);
    const paramPipes = paramPipeEntry?.pipes ?? [];

    return [...globalPipes, ...classPipes, ...methodPipes, ...paramPipes];
}

export async function runPipes (
    controllerCls: Function,
    handler: Function,
    value: unknown,
    meta: ArgumentMetadata,
    globalPipes: PipesType[] = [],
) {
    const pipes = getPipes(handler, controllerCls, meta.index, globalPipes);

    let transformed = value;

    for (const PipeCtor of pipes) {
        const pipeInstance = isClass(PipeCtor) ? container.resolve<PipeTransform>(PipeCtor) : PipeCtor;

        try {
            transformed = await Promise.resolve(
                pipeInstance.transform(transformed, meta)
            );
        } catch (err) {
            console.error('Pipe error:', err);
            throw err;
        }

    }
     return transformed;
}