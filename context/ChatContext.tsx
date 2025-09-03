"use client";

import { createContext, useContext } from "react";
import { useChatHistory } from "@/hooks/useChatHistory";

type ChatContextType = ReturnType<typeof useChatHistory> & {
  createConversation: (title?: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  activeConversation: string | null;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const chat = useChatHistory(userId);

  const createConversation = (title?: string) => chat.createConversation(title);
  const renameConversation = (id: string, newTitle: string) =>
    chat.renameConversation(id, newTitle);
  const deleteConversation = (id: string) => chat.deleteConversation(id);
  const setActiveConversation = (id: string) => chat.setActiveConversation(id);
  const activeConversation = chat.activeConversation;

  return (
    <ChatContext.Provider
      value={{
        ...chat,
        createConversation,
        renameConversation,
        deleteConversation,
        setActiveConversation,
        activeConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
}
