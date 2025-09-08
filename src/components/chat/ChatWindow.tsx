"use client";

import { useChat } from "@/src/context/ChatContext";
import { Button } from "@/src/theme/ui/button";
import { Input } from "@/src/theme/ui/input";
import { ScrollArea } from "@/src/theme/ui/scroll-area";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatWindow() {
  const { activeConversation, messages, addMessage } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");

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

      if (!res.body) throw new Error("No stream returned");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setTypingText("");

      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        botReply += chunk;
        setTypingText(botReply);
      }

      await addMessage("bot", botReply);
      setTypingText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const components: React.ComponentProps<typeof ReactMarkdown>["components"] = {
    code: ({ node, className, children, ...props }) => (
      <code
        className="bg-gray-800 text-gray-200 p-1 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    ),
    table: ({ node, children, ...props }) => (
      <div className="overflow-x-auto my-2">
        <table
          className="min-w-full border-collapse border border-gray-300"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ node, children, ...props }) => (
      <th
        className="border border-gray-300 px-3 py-2 bg-gray-700 font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ node, children, ...props }) => (
      <td className="border border-gray-300 px-3 py-2" {...props}>
        {children}
      </td>
    ),
    a: ({ node, children, ...props }) => (
      <a className="text-blue-300 underline" {...props}>
        {children}
      </a>
    ),
  };

  return (
    <div className="flex flex-col h-full flex-1 shadow-2xl rounded-sm border-[1px] border-[#feca477a] bg-[var(--bg)] w-auto">
      <ScrollArea className="flex-1 my-5 px-4 py-3">
        <div className="space-y-3">
          {messages.map((msg, index: number) => (
            <div className="flex flex-col" key={index}>
              {msg.sender === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-gray-800 text-gray-200 rounded-br-none max-w-xs px-4 py-2 rounded-2xl lg:text-md">
                    {msg.message}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-3xl px-4 py-2 rounded-2xl text-md bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-bl-none whitespace-pre-wrap">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={components}
                    >
                      {msg.message}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {typingText && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-2 rounded-2xl text-md bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-bl-none whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {typingText}
                </ReactMarkdown>
                <span className="animate-pulse">▋</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-800 flex items-center gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Send Your message ..."
          className="flex-1 rounded-sm py-5"
        />
        <Button
          onClick={sendMessage}
          disabled={loading}
          className="h-[42px] bg-gradient-to-br from-[#FDE047] to-[#FDB447] text-sm font-bold text-[#1A1C1E] transition-all hover:from-[#FDB447] hover:to-[#FDE047]"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
