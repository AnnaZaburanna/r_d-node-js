import { Module } from '@nestjs/common';
import {UsersController} from "./users.controller";
import {Store} from "../store/store";

@Module({
  controllers: [UsersController],
  providers: [Store],
  exports: [Store],
})
export class UsersModule {}
