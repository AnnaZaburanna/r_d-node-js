import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import Redis from 'ioredis';
import {v4 as uuid} from 'uuid';
import {OnModuleDestroy} from '@nestjs/common';
import {Store} from "../store/store";
import {ChatDTO} from "../dto";

function isNonEmptyString(v: any): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

const INSTANCE_ID = uuid();
@WebSocketGateway({path: '/ws', cors: true})
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private readonly sub: Redis;
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();

  private getSocketsForUser(userId: string): Socket[] {
    const sockets: Socket[] = [];
    this.server.sockets.sockets.forEach((socket: Socket) => {
      if (socket.data.user === userId) sockets.push(socket);
    });
    return sockets;
  }

  public emitMembersUpdated(payload: { chatId: string; members: string[]; previousMembers: string[] }) {
    if (!payload || !isNonEmptyString(payload.chatId)) return;
    const chatId = payload.chatId;
    const members = uniq((payload.members ?? []).filter(isNonEmptyString));
    const previousMembers = uniq((payload.previousMembers ?? []).filter(isNonEmptyString));

    if (members.length < 2) {
      console.warn('emitMembersUpdated: dropped invalid payload (members < 2)', {chatId, members});
      return;
    }

    const affectedUsers = new Set([...members, ...previousMembers]);
    for (const userId of affectedUsers) {
      this.getSocketsForUser(userId).forEach((socket) => {
        socket.emit('membersUpdated', {chatId, members});
      });
    }

    this.event$.next({
      ev: 'membersUpdated',
      data: {chatId, members, previousMembers},
      meta: {local: true},
    });
  }

  private handleChatCreated(chat: ChatDTO, ev: string) {
    chat.members.forEach((member: string) => {
      const sockets = this.getSocketsForUser(member);
      sockets.forEach((socket) => {
        if (!socket.rooms.has(chat.id)) socket.join(chat.id);
        socket.emit(ev, {chatId: chat.id, ...chat});
      });
    });
  }

  private emitToChatMembers(members: string[], event: string, payload: any, opts?: { exclude?: string }) {
    const exclude = opts?.exclude;
    const uniqueMembers = Array.from(new Set(members));
    for (const userId of uniqueMembers) {
      if (exclude && userId === exclude) continue;
      this.getSocketsForUser(userId).forEach((socket) => {
        socket.emit(event, payload);
      });
    }
  }

  private handleMembersUpdated(data: { chatId: string; members: string[] }) {
    const {chatId} = data;
    const members = uniq((data.members ?? []).filter(isNonEmptyString));
    if (!isNonEmptyString(chatId) || members.length < 2) return;

    const affected = new Set(members);
    affected.forEach((userId) => {
      this.getSocketsForUser(userId).forEach((socket) => {
        socket.emit('membersUpdated', {chatId, members});
      });
    });
  }

  constructor(private store: Store, private readonly redis: Redis) {
    this.sub = this.redis.duplicate();

    this.sub.subscribe('chat-events');
    this.sub.on('message', (_, raw) => {
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return;
      }
      if (parsed?.src === INSTANCE_ID) return;
      if (!parsed || !isNonEmptyString(parsed.ev)) return;

      if (parsed.ev === 'chatCreated' || parsed.ev === 'membersUpdated') {
        this.event$.next({ev: parsed.ev, data: parsed.data});
      }
    });

    this.event$
        .pipe(filter((e) => e.meta?.local))
        .subscribe((e) =>
            this.redis.publish('chat-events', JSON.stringify({...e, meta: undefined, src: INSTANCE_ID}))
        );

    this.event$.subscribe(async (e) => {
      const isLocal = !!e.meta?.local;
      try {
        switch (e.ev) {
          case 'chatCreated': {
            const chat: ChatDTO = e.data;
            const existing = this.store.getChatById(chat.id);
            if (!existing) await this.store.addChat(chat);
            this.handleChatCreated(chat, 'chatCreated');
            break;
          }
          case 'membersUpdated': {
            const {chatId, members} = e.data || {};
            if (!chatId || !Array.isArray(members) || new Set(members).size < 2) return;
            const chat = this.store.getChatById(chatId);
            if (chat) {
              await this.store.updateChat(chat.id, (c) => {
                c.members = Array.from(new Set(members));
                c.updatedAt = new Date().toISOString();
              });
            }
            this.handleMembersUpdated({chatId, members});
            break;
          }
          case 'message': {
            if (isLocal) break;
            const {message} = e.data || {};
            if (!message?.chatId || !message?.author) return;
            const chat = this.store.getChatById(message.chatId);
            if (!chat) return;
            this.emitToChatMembers(chat.members, 'message', message);
            break;
          }
          case 'typing': {
            const {chatId, user, isTyping} = e.data || {};
            if (!chatId || !user) return;
            const chat = this.store.getChatById(chatId);
            if (!chat) return;
            this.emitToChatMembers(chat.members, 'typing', {chatId, user, isTyping}, {exclude: user});
            break;
          }
        }
      } catch (err) {
        console.error('Gateway event handling error', e, err);
      }
    });
  }


  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;
    if (!user) return client.disconnect(true);

    client.data.user = user;
    console.log(`User ${user} connected with ID ${client.id}`);

    const chats = this.store.getChatsForUser(user);
    chats.forEach((c) => {
      if (!client.rooms.has(c.id)) client.join(c.id);
    });
  }

  @SubscribeMessage('join')
  onJoin(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string }) {
    const {user} = client.data;
    const chat = this.store.getChatById(body.chatId);

    if (!client.rooms.has(body.chatId)) {
      client.join(body.chatId);
    }

    if (!chat || !chat.members.includes(user)) {
      return client.emit('error', 'Access denied');
    }

    client.join(body.chatId);
  }


  @SubscribeMessage('leave')
  async onLeave(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string }) {
    const {user} = client.data;
    const chat = this.store.getChatById(body.chatId);

    if (!chat || !chat.members.includes(user)) {
      return client.emit('error', 'Access denied');
    }

    const next = chat.members.filter((m) => m !== user);

    if (next.length < 2) {
      return client.emit('error', 'Cannot leave: chat must have at least 2 members');
    }

    const previousMembers = [...chat.members];

    await this.store.updateChat(chat.id, (c) => {
      const clean = uniq(next.filter(isNonEmptyString));
      if (clean.length < 2) throw new Error('Invariant: members must be >= 2');
      c.members = clean;
      c.updatedAt = new Date().toISOString();
    });

    this.emitMembersUpdated({
      chatId: chat.id,
      members: next,
      previousMembers,
    });

    client.leave(body.chatId);
  }

  @SubscribeMessage('send')
  async onSend(
      @ConnectedSocket() client: Socket,
      @MessageBody() body: { chatId: string; text: string }
  ) {
    const author = client.data.user;
    const chat = this.store.getChatById(body.chatId);

    if (!chat || !chat.members.includes(author)) {
      return client.emit('error', 'Access denied');
    }

    const message = {
      id: uuid(),
      chatId: body.chatId,
      author,
      text: String(body.text ?? '').trim(),
      sentAt: new Date().toISOString(),
    };

    await this.store.addMessage(message);

    client.emit('message', message);

    this.emitToChatMembers(chat.members, 'message', message, {exclude: author});

    this.event$.next({
      ev: 'message',
      data: {message},
      meta: {local: true},
    });
  }

  @SubscribeMessage('typing')
  onTyping(
      @ConnectedSocket() client: Socket,
      @MessageBody() body: { chatId: string; isTyping: boolean }
  ) {
    const user = client.data.user;
    const chat = this.store.getChatById(body.chatId);

    if (!chat || !chat.members.includes(user)) {
      return client.emit('error', 'Access denied');
    }

    this.emitToChatMembers(chat.members, 'typing', {
      chatId: body.chatId,
      user,
      isTyping: body.isTyping,
    }, {exclude: user});

    this.event$.next({
      ev: 'typing',
      data: {chatId: body.chatId, user, isTyping: body.isTyping},
      meta: {local: true},
    });
  }
}