//

import { ChatDTO, MessageDTO, UserDTO } from "../dto";
import * as path from "path";
import * as fsp from "fs/promises";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { Injectable, OnModuleInit } from "@nestjs/common";

// ---- File paths -------------------------------------------------------------
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

class WriteLock {
  private chain = Promise.resolve();
  run<T>(task: () => Promise<T>): Promise<T> {
    const next = this.chain.then(task, task);
    this.chain = next.then(
        () => void 0,
        () => void 0,
    );
    return next;
  }
}

// ---- JSON helpers -----------------------------------------------------------
async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    const trimmed = raw.trim();
    if (!trimmed) return fallback;
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fsp.readFile(file, "utf-8");
    return safeParse<T>(raw, fallback);
  } catch {
    return fallback;
  }
}

function readJsonFileSync<T>(file: string, fallback: T): T {
  try {
    const raw = readFileSync(file, "utf-8");
    return safeParse<T>(raw, fallback);
  } catch {
    return fallback;
  }
}

async function writeJsonAtomic(file: string, data: unknown) {
  const tmp = `${file}.tmp`;
  const json = JSON.stringify(data, null, 2);
  await fsp.writeFile(tmp, json, "utf-8");
  await fsp.rename(tmp, file);
}

@Injectable()
export class Store implements OnModuleInit {
  private users: UserDTO[] = [];
  private chats: ChatDTO[] = [];
  private messages: MessageDTO[] = [];
  private lock = new WriteLock();
  async onModuleInit() {
    await ensureDir(DATA_DIR);

    const [users, chats, messages] = await Promise.all([
      readJsonFile<UserDTO[]>(USERS_FILE, []),
      readJsonFile<ChatDTO[]>(CHATS_FILE, []),
      readJsonFile<MessageDTO[]>(MESSAGES_FILE, []),
    ]);

    this.users = users;
    this.chats = chats;
    this.messages = messages;
  }

  // --- Users -----------------------------------------------------------------
  private async saveUsers() {
    await this.lock.run(() => writeJsonAtomic(USERS_FILE, this.users));
  }
  getUsers(): UserDTO[] {
    this.users = readJsonFileSync<UserDTO[]>(USERS_FILE, this.users ?? []);
    return this.users;
  }
  getUserById(id: string): UserDTO | undefined {
    this.users = readJsonFileSync<UserDTO[]>(USERS_FILE, this.users ?? []);
    return this.users.find((u) => u.id === id);
  }
  async addUser(user: UserDTO) {
    this.users.push(user);
    await this.saveUsers();
  }

  // --- Chats -----------------------------------------------------------------
  private async saveChats() {
    await this.lock.run(() => writeJsonAtomic(CHATS_FILE, this.chats));
  }
  getChatsForUser(userId: string): ChatDTO[] {
    this.chats = readJsonFileSync<ChatDTO[]>(CHATS_FILE, this.chats ?? []);
    return this.chats.filter((c) => c.members.includes(userId));
  }
  getChatById(id: string): ChatDTO | undefined {
    this.chats = readJsonFileSync<ChatDTO[]>(CHATS_FILE, this.chats ?? []);
    return this.chats.find((c) => c.id === id);
  }
  async addChat(chat: ChatDTO) {
    this.chats.push(chat);
    await this.saveChats();
  }
  async updateChat(id: string, updater: (chat: ChatDTO) => void) {
    const chat = this.getChatById(id);
    if (chat) {
      updater(chat);
      await this.saveChats();
    }
  }
  async deleteChat(id: string) {
    this.chats = this.chats.filter((c) => c.id !== id);
    await this.saveChats();
  }

  // --- Messages --------------------------------------------------------------
  private async saveMessages() {
    await this.lock.run(() => writeJsonAtomic(MESSAGES_FILE, this.messages));
  }
  async addMessage(msg: MessageDTO) {
    this.messages.push(msg);
    await this.saveMessages();
  }
  async getMessages(chatId: string): Promise<MessageDTO[]> {
    this.messages = await readJsonFile<MessageDTO[]>(MESSAGES_FILE, this.messages ?? []);
    return this.messages
        .filter((m) => m.chatId === chatId)
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }
}