export function Module(metadata: { controllers?: any[], providers?: any[], imports?: any[] }) {
    return function (target: any) {
        Reflect.defineMetadata('mini:module', metadata, target)
    }
}