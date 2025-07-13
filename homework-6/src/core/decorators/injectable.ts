import {container} from "../container";

const INJECT_TOKENS = 'custom:inject_tokens';

export function Injectable() {
    return function (target: any) {
        container.register(target, target)
    }
}

export function Inject(token?: any) {
    return function (target: Object, _propertyKey: string | symbol | undefined, parameterIndex: number) {
        const existingTokens = Reflect.getMetadata(INJECT_TOKENS, target) || {};
        existingTokens[parameterIndex] = token;
        Reflect.defineMetadata(INJECT_TOKENS, existingTokens, target);
    }
}