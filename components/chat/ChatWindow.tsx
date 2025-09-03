"use client";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";

export default function ChatWindow() {
  const { activeConversation, messages, addMessage } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState(""); // متن ربات در حال تایپ

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select or create a chat
      </div>
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);

    await addMessage("user", input);
    const userMsg = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (data.reply) {
        await typeBotMessage(data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function typeBotMessage(message: string) {
    setTypingText("");
    for (let i = 1; i <= message.length; i++) {
      setTypingText(message.substring(0, i));
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    await addMessage("bot", message);
    setTypingText("");
  }

  return (
    <div className="flex flex-col h-[82vh] flex-1 bg-[#0f0f12] border border-gray-800 rounded-2xl shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent my-5">
        {messages.map((msg, index: number) => (
          <div className="flex flex-col" key={index}>
            {msg.sender === "user" ? (
              <div className="flex justify-end">
                <div className="bg-gray-800 text-gray-200 rounded-br-none max-w-xs px-4 py-2 rounded-2xl text-sm">
                  {msg.message}
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-2xl text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-bl-none whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            )}
          </div>
        ))}
        {/* نمایش تایپ ربات */}
        {typingText && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-2xl text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-bl-none whitespace-pre-wrap">
              {typingText}
              <span className="animate-pulse">▋</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Send Your message ..."
          className="flex-1 text-start px-4 py-2 rounded-xl bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          disabled={loading}
          onClick={sendMessage}
          className="px-4 py-2 rounded-xl cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
