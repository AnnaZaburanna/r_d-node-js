import { Module } from '@nestjs/common';
import {MessagesController} from "./messages.controller";
import {FileStore} from "../store/file-store";
import {Store} from "../store/store";

@Module({
  controllers: [MessagesController],
  providers: [ {
    provide: Store,
    useClass: FileStore,
  },FileStore]
})
export class MessagesModule {}
