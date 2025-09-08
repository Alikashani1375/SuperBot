"use client";

import ChatSidebar from "@/src/components/chat/ChatSidebar";
import ChatWindow from "@/src/components/chat/ChatWindow";
import { ChatProvider } from "@/src/context/ChatContext";

export default function ChatPage() {
  const userId = "user-123";

  return (
    <ChatProvider userId={userId}>
      <div className="flex gap-3">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
