import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {LoggerModule} from "./logger/logger.module";
import {NotificationModule} from "./notification/notification.module";

@Module({
  imports: [NotificationModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
