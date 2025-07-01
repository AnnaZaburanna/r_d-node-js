export const mergeSpecs = (target, source) => {
    target.paths = Object.assign({}, target.paths, source.paths);
    target.components ??= {};
    target.components.schemas ??= {};
    if (source.components?.schemas) {
        target.components.schemas = Object.assign({}, target.components.schemas, source.components.schemas);
    }

    if (source.tags) {
        const tagNames = new Set(target.tags?.map(t => t.name) ?? []);
        target.tags = [
            ...(target.tags ?? []),
            ...source.tags.filter(t => !tagNames.has(t.name))
        ];
    }

    return target;
}