import 'reflect-metadata';

export class Container {
    #registered = new Map();
    #singletons = new Map();

    resolve<T>(token: new (...args: any[]) => T): T {
        if (this.#singletons.has(token)) return this.#singletons.get(token);

        const cs = this.#registered.get(token)

        if (!cs) {
            throw new Error(`Token ${token.name} is not registered.`);
        }

        const deps: any[] = Reflect.getMetadata("design:paramtypes", token) || [];

        const injectTokens = Reflect.getMetadata("custom:inject_tokens", token) || {};

        const resolved = new cs(...deps.map((dep, index) => {
            const actualToken = injectTokens[index] || dep;
            if (actualToken === token) {
                throw new Error(`Circular dependency detected for token ${token.name}.`);
            }
            return this.resolve(actualToken);
        }))

        this.#singletons.set(token, resolved);
        return resolved
    }

    register<T extends Function>(token: T, member: T): void {
        if(this.#registered.has(token)) {
            throw new Error(`Token ${token.name} is already registered.`);
        }
        this.#registered.set(token, member);
    }
}

export const container = new Container()