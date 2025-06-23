import * as fs from "fs";
import * as path from "path";
import {fileURLToPath} from "node:url";

function pathToFileURL(p) {
    return new URL(`file://${p}`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const  buildRoutes = async(dir = path.join(__dirname, 'routes'), baseUrl = '') =>  {
    const entries = fs.readdirSync(dir);
    const routes = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const segment = entry.startsWith('[') && entry.endsWith(']')
                ? `:${entry.slice(1, -1)}`
                : entry;

            const childRoutes = await buildRoutes(fullPath, `${baseUrl}/${segment}`);
            routes.push(...childRoutes);
        }

        if (stat.isFile() && /^route\.(js|ts)$/.test(entry)) {
            const modulePath = pathToFileURL(fullPath).href;
            const handler = await import(modulePath);
            routes.push({ path: baseUrl || '/', handler });
        }
    }

    return routes;
}

export const matchRoute = (pathname, routes) => {
    return routes
        .map(route => {
            const paramNames = [];
            const regexPath = route.path.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            });

            const regex = new RegExp(`^${regexPath}$`);
            const match = pathname.match(regex);

            if (!match) return null;

            const params = paramNames.reduce((acc, name, i) => {
                acc[name] = match[i + 1];
                return acc;
            }, {});

            return { handler: route.handler, params };
        })
        .find(result => result !== null) || null;
}
