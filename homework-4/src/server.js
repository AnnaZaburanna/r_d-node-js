import {createApp} from "./app.js";
import http from 'node:http';
import {config} from "./config/index.js";

const app = createApp();
const server = http.createServer(app);

server.listen(config.port, () =>
    console.log(`${config.env} API ready on http://localhost:${config.port}`)
);

function shutDown() {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Closed all remaining connections');
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
}
process.on('SIGTERM', shutDown);
process.on('SIGINT',  shutDown);