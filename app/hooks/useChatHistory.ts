import { useEffect, useState } from "react";

export type ChatMessage = { user: string; bot: string };

export function useChatHistory() {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setChatLog(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (chatLog.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatLog));
    }
  }, [chatLog]);

  return { chatLog, setChatLog };
}
