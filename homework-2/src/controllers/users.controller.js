import {buildRoutes, matchRoute} from "../lib/router.js";
import {fileURLToPath} from "node:url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = await buildRoutes(path.join(__dirname, '../routes'));
export const handle = async (req, res) => {
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = fullUrl.pathname;

    const method = req.method;

    const match = matchRoute(pathname, routes);
    if (!match) {
        res.writeHead(404);
        return res.end('Not Found');
    }

    const handler = match.handler[method];
    if (!handler) {
        res.writeHead(405);
        return res.end('Method Not Allowed');
    }
    try {
        const body = await bodyJSON(req);
        await handler(req, res, match.params, body);
    } catch (err) {
        const status = err.status || 500;
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
}

function bodyJSON(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (c) => (raw += c));
        req.on('end', () => {
            try   { resolve(JSON.parse(raw || '{}')); }
            catch { reject(new Error('Invalid JSON')); }
        });
    });
}