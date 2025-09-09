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
    return conv;
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

    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === activeConversation) {
          const newMessage = { sender, message };
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      });
      const updatedConv = updated.find((c) => c.id === activeConversation);
      if (updatedConv) {
        saveConversation(updatedConv);
      }

      return updated;
    });
  }

  async function renameConversation(id: string, newTitle: string) {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === id) {
          return { ...conv, title: newTitle };
        }
        return conv;
      });
      const updatedConv = updated.find((c) => c.id === id);
      if (updatedConv) {
        saveConversation(updatedConv);
      }

      return updated;
    });
  }

  async function deleteConversation(id: string) {
    const db = await getDB();
    await db.delete("conversations", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversation === id) {
      setActiveConversationState(null);
    }
  }

  async function updateMessage(
    conversationId: string,
    messageIndex: number,
    newMessage: string
  ) {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map((msg, i) =>
            i === messageIndex ? { ...msg, message: newMessage } : msg
          );
          return { ...conv, messages: updatedMessages };
        }
        return conv;
      });

      const updatedConv = updated.find((c) => c.id === conversationId);
      if (updatedConv) {
        saveConversation(updatedConv);
      }

      return updated;
    });
  }

  async function trimConversation(conversationId: string, index: number) {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, messages: conv.messages.slice(0, index + 1) };
        }
        return conv;
      });
      const updatedConv = updated.find((c) => c.id === conversationId);
      if (updatedConv) {
        saveConversation(updatedConv);
      }

      return updated;
    });
  }

  return {
    conversations,
    messages:
      conversations.find((c) => c.id === activeConversation)?.messages || [],
    activeConversation,
    setActiveConversation,
    createConversation,
    addMessage,
    updateMessage,
    renameConversation,
    deleteConversation,
    trimConversation,
  };
}
