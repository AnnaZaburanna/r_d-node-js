import {NestFactory} from "./core/http/nest-factory";
import {AppModule} from "./apps/app.module";
import { ZodValidationPipe} from "./apps/pipes/zod.pipe";
import {container} from "./core/container";
import {ParseIntPipe} from "./apps/pipes/parse-int.pipe";

const port = 3000;


async function bootstrap() {
    const app = NestFactory.create(AppModule);

    container.register(ZodValidationPipe, ZodValidationPipe)
    container.register(ParseIntPipe, ParseIntPipe)

    await app.listen(port, () => {
        console.log(`Mini-Nest listening on http://localhost:${port}`);
    });


}
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

bootstrap();
