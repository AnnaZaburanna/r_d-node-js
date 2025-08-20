import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  {
    bufferLogs: true,
        logger: ['log', 'error', 'warn', 'debug'],
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nestjs-demo',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'nestjs-consumer-group',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log('✅ HTTP: http://localhost:3000');
}
bootstrap();
