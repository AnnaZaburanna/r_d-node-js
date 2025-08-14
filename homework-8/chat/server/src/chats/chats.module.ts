import {Module} from '@nestjs/common';
import {ChatsController} from './chats.controller';
import {UsersModule} from "../users/users.module";
import {WsModule} from "../ws/ws.module";

@Module({
  imports: [UsersModule, WsModule],
  controllers: [ChatsController],
})
export class ChatsModule { }
