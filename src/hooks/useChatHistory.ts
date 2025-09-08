"use client";
import { useState, useEffect, useCallback } from "react";
import { openDB } from "idb";

export type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

export function useChatHistory(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<
    string | null
  >(null);

  function setActiveConversation(id: string) {
    setActiveConversationState(id);
  }

  async function getDB() {
    return openDB("chat-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("conversations")) {
          db.createObjectStore("conversations", { keyPath: "id" });
        }
      },
    });
  }

  const loadConversations = useCallback(async () => {
    const db = await getDB();
    const all = await db.getAll("conversations");
    setConversations(all);
    if (all.length > 0 && !activeConversation) setActiveConversation(all[0].id);
  }, [activeConversation]);

  useEffect(() => {
    loadConversations();
  }, [userId, loadConversations]);

  async function saveConversation(conv: Conversation) {
    const db = await getDB();
    await db.put("conversations", conv);
  }

  async function createConversation(title?: string): Promise<string> {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: title || "New Chat",
      messages: [],
    };
    await saveConversation(newConv);
    setConversations((prev) => [...prev, newConv]);
    setActiveConversation(newConv.id);

    return newConv.id;
  }

  async function addMessage(sender: "user" | "bot", message: string) {
    if (!activeConversation) return;
    const conv = conversations.find((c) => c.id === activeConversation);
    if (!conv) return;
    conv.messages.push({ sender, message });
    await saveConversation(conv);
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? conv : c)));
  }

  async function renameConversation(id: string, newTitle: string) {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    conv.title = newTitle;
    await saveConversation(conv);
    setConversations((prev) => prev.map((c) => (c.id === id ? conv : c)));
  }

  async function deleteConversation(id: string) {
    const db = await getDB();
    await db.delete("conversations", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversation === id) {
      setActiveConversationState(null);
    }
  }

  return {
    conversations,
    messages:
      conversations.find((c) => c.id === activeConversation)?.messages || [],
    activeConversation,
    setActiveConversation,
    createConversation,
    addMessage,
    renameConversation,
    deleteConversation,
  };
}
