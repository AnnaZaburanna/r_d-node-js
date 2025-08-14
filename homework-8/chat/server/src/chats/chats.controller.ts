import { Body, Controller, Delete, ForbiddenException, Get, Headers, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import {ChatDTO} from "../dto";
import Redis from "ioredis";
import {Store} from "../store/store";
import { v4 as uuidv4 } from 'uuid';
import {ChatGateway} from "../ws/chat.gateway";

@Controller('/api/chats')
export class ChatsController {
  constructor(
    private store: Store,
    private redis: Redis,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  async create(
    @Headers('X-User') creator: string,
    @Body() body: { name?: string; members: string[] },
  ): Promise<ChatDTO> {
    if (!creator) throw new ForbiddenException('Missing X-User');
    const members = Array.from(new Set(body.members));

    if (!members.includes(creator)) members.push(creator);
    if (members.length < 2) throw new ForbiddenException('Chat must have at least 2 members');

    const name = body.name || (members.length === 2
        ? `${members[0]} & ${members[1]}`
        : `Group Chat (${creator})`);

    const chat:ChatDTO = {
      id: uuidv4(),
      name,
      members,
      updatedAt: String(new Date()),
    };

    await this.store.addChat(chat);

    this.chatGateway['event$'].next({
      ev: 'chatCreated',
      data: chat,
      meta: { local: true }
    });

    return chat;
  }

  @Get()
  list(@Headers('X-User') user: string) {
    return {items: this.store.getChatsForUser(user)}
  }
  @Patch(':id/members')
  async patch(
      @Headers('X-User') actor: string,
      @Param('id') id: string,
      @Body() dto: { add?: string[]; remove?: string[] },
  ) {
    if (!actor) throw new ForbiddenException('Missing X-User');

    const adds = Array.from(new Set((dto.add ?? []).filter((x): x is string => x.trim().length > 0)));
    const removes = Array.from(new Set((dto.remove ?? []).filter((x): x is string => x.trim().length > 0)));

    const beforeChat = this.store.getChatById(id);
    if (!beforeChat) throw new NotFoundException('Chat not found');
    const originalMembers = [...beforeChat.members];

    if (adds.length === 0 && removes.length === 0) {
      return { id, members: originalMembers };
    }

    await this.store.updateChat(id, (c) => {
      const set = new Set(c.members);

      for (const m of adds) set.add(m);
      for (const m of removes) set.delete(m);
      set.add(actor);

      if (set.size < 2) {
        throw new ForbiddenException('Chat must have at least 2 members');
      }

      c.members = Array.from(set);
      c.updatedAt = new Date().toISOString();
    });

    const afterChat = this.store.getChatById(id);
    if (!afterChat) throw new NotFoundException('Chat not found after update');

    const finalMembers = [...afterChat.members];

    this.chatGateway.emitMembersUpdated({
      chatId: afterChat.id,
      members: finalMembers,
      previousMembers: originalMembers,
    });

    return { id, members: finalMembers };
  }

  @Delete(':id')
  async delete(@Headers('X-User') admin: string, @Param('id') id: string) {
    const chat = this.store.getChatById(id);
    if (!chat) throw new NotFoundException('Chat not found');

    await this.store.deleteChat(id);
  }
}
