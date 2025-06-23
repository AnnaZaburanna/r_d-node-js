import http from 'node:http';
import { handle as userCtrl } from './controllers/users.controller.js';

const server = http.createServer(async (req, res) => {
    const [ , resource, id ] = req.url.split('/');

    if (resource === 'users') {
        return userCtrl(req, res, id || null);
    }
    res.writeHead(404).end('Not found');
})

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})