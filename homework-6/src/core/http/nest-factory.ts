import {Express} from "express";
import {Factory} from "./router";

export class NestApplication {
    constructor(private app: Express) {}

    listen(port: number) {
        return new Promise<void>((resolve) => {
            this.app.listen(port, () => {
                console.log(`🚀 App is running on http://localhost:${port}`);
                resolve();
            });
        })
    }
    getHttpAdapter(): Express {
        return this.app;
    }
}

export const NestFactory = {
    create: (rootModule: any) => {
        return Factory([rootModule]);
    }
};