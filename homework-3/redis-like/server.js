import http from "node:http";

function r(json, res) { res.end(JSON.stringify(json)); }

const store = new Map();

const PORT = 4000;

const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    if (req.method === 'GET' && u.pathname === '/get') {
        return r({ value: store.get(u.searchParams.get('key')) ?? null }, res);
    }
    if (req.method === 'POST' && u.pathname === '/set') {
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
            const { key, value } = JSON.parse(body);
            store.set(key, value);
            r({ ok: true }, res);
        });
        return;
    }
    res.statusCode = 404;
    res.end('Not found');
});

server.listen(PORT, () => console.log(`redis-like :${PORT}`));