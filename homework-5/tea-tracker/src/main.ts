import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {LoggingInterceptor} from "./tea/shared/interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);

  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest demo API')
      .setDescription('Tea-Tracker API')
      .setVersion('1.0')
      .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' },
          'x-api-key',)
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document)

  const port = process.env.PORT || 3000;

  logger.log(`Swagger docs available at http://localhost:${port}/docs`);

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
