import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import {ChatGateway} from "./chat.gateway";
import {FileStore} from "../store/file-store";
import {Store} from "../store/store";

@Module({
  imports: [RedisModule],
  providers: [ChatGateway, FileStore, Store],
  exports: [ChatGateway]
})
export class WsModule {}
