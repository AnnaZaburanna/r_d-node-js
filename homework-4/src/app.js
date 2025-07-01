import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import compression from 'compression';
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import pino from "pino-http";
import {scopePerRequest} from "awilix-express";
import {container} from "./container.js";
import {config} from "./config/index.js";
import swaggerUi from 'swagger-ui-express';
import {generateSpecs} from './docs/index.js';
import { router as brewsRouter } from './routes/brews.routes.js';

export const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(rateLimit({
        windowMs: 60_000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false
    }));

    app.use(morgan('dev'));
    app.use(pino());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(scopePerRequest(container));

    if(config.env === 'development') {
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(generateSpecs()));
        console.log(`Swagger docs → ${config.baseUrl}/docs`);
    }

    app.use('/api', brewsRouter)
    return app;
}