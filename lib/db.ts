import Dexie, { Table } from "dexie";

export interface ChatMessage {
  id?: number;
  userId: string;
  conversationId: string;
  sender: "user" | "bot";
  message: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
}

export class ChatDB extends Dexie {
  messages!: Table<ChatMessage, number>;
  conversations!: Table<Conversation, string>;

  constructor() {
    super("chatDB");
    this.version(1).stores({
      conversations: "id, userId, createdAt",
      messages: "++id, conversationId, userId, createdAt",
    });
  }
}

export const db = new ChatDB();
