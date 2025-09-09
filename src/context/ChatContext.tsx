"use client";

import { createContext, useContext } from "react";
import { useChatHistory } from "../hooks/useChatHistory";

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

  const updateMessage = (
    conversationId: string,
    messageIndex: number,
    newMessage: string
  ) => chat.updateMessage(conversationId, messageIndex, newMessage);
  const createConversation = (title?: string) => chat.createConversation(title);
  const renameConversation = (id: string, newTitle: string) =>
    chat.renameConversation(id, newTitle);
  const deleteConversation = (id: string) => chat.deleteConversation(id);
  const setActiveConversation = (id: string) => chat.setActiveConversation(id);
  const activeConversation = chat.activeConversation;
  const trimConversation = (conversationId: string, index: number) =>
    chat.trimConversation(conversationId, index);

  return (
    <ChatContext.Provider
      value={{
        ...chat,
        createConversation,
        renameConversation,
        deleteConversation,
        setActiveConversation,
        activeConversation,
        updateMessage,
        trimConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("context invalid");
  return context;
}
