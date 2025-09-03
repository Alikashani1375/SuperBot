// app/chat/page.tsx
"use client";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { ChatProvider } from "@/context/ChatContext";

export default function ChatPage() {
  const userId = "user-123";

  return (
    <ChatProvider userId={userId}>
      <div className="flex gap-3 p-3">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
