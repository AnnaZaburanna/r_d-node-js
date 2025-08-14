import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import {MessageDTO} from "../dto";
import {Store} from "../store/store";
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/chats/:id/messages')
export class MessagesController {
  constructor(private store: Store) {}

  @Get()
  async list(
    @Headers('X-User') user: string,
    @Param('id') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '30',
  ) {
    try {
      const chat = this.store.getChatById(chatId);
      if (!chat) throw new NotFoundException('Chat not found');


      if (!chat.members.includes(user)) {
        throw new ForbiddenException('Access denied');
      }

      const messages = await this.store.getMessages(chatId);

      const startIndex = cursor
          ? messages.findIndex(m => m.sentAt > cursor)
          : 0;

      const limitNum = Math.max(1, Math.min(Number(limit) || 30, 100));
      const sliced = messages.slice(startIndex, startIndex + limitNum);

      const nextCursor =
          sliced.length === limitNum ? sliced[sliced.length - 1].sentAt : undefined;

      return {
        items: sliced,
        ...(nextCursor ? {nextCursor} : {}),
      };
    } catch (e) {
      console.error("Error:", e);
    }
  }

  @Post()
 async create(
    @Headers('X-User') author: string,
    @Param('id') chatId: string,
    @Body('text') text: string,
  ): Promise<MessageDTO | undefined> {
    try {
      const chat = this.store.getChatById(chatId);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      if (!chat.members.includes(author)) {
        throw new ForbiddenException('Only chat members can post');
      }


      const message: MessageDTO = {
        id: uuidv4(),
        chatId,
        author,
        text: text.trim(),
        sentAt: new Date().toISOString(),
      };

      await this.store.addMessage(message);

      return message;
    } catch (e) {
      console.error("Error:", e);
    }
  }
}
