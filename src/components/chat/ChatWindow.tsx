"use client";

import { useChat } from "@/src/context/ChatContext";
import { Button } from "@/src/theme/ui/button";
import { Input } from "@/src/theme/ui/input";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Edit, Check, X, Copy, RefreshCw } from "lucide-react";
import { Virtuoso } from "react-virtuoso";

export default function ChatWindow() {
  const {
    activeConversation,
    messages,
    addMessage,
    updateMessage,
    trimConversation,
  } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && editingIndex !== null) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editValue, editingIndex]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select or create a chat
      </div>
    );
  }

  async function handleSaveEdit(newText: string) {
    if (editingIndex === null || !activeConversation) return;

    try {
      await updateMessage(activeConversation, editingIndex, newText);
      await trimConversation(activeConversation, editingIndex);

      setEditingIndex(null);
      setEditValue("");

      setLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newText }),
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
      await addMessage(
        "bot",
        "Sorry, there was an error processing your request."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(messageText?: string, fromEdit = false) {
    const text = messageText ?? input;
    if (!text.trim()) return;

    if (!fromEdit) {
      await addMessage("user", text);
      setInput("");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
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
      await addMessage(
        "bot",
        "Sorry, there was an error processing your request."
      );
    } finally {
      setLoading(false);
    }
  }

  const startEditing = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regenerateResponse = async (index: number) => {
    if (index < 0 || index >= messages.length) return;
    const userMessage = messages[index].message;
    setLoading(true);
    await trimConversation(activeConversation!, index + 1);
    await sendMessage(userMessage, true);
  };

  const components: React.ComponentProps<typeof ReactMarkdown>["components"] = {
    code: ({ children, ...props }) => (
      <code
        className="bg-gray-800 text-gray-200 p-1 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-2">
        <table
          className="min-w-full border-collapse border border-gray-300"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-gray-300 px-3 py-2 bg-gray-700 font-medium"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-gray-300 px-3 py-2" {...props}>
        {children}
      </td>
    ),
    a: ({ children, ...props }) => (
      <a className="text-blue-300 underline" {...props}>
        {children}
      </a>
    ),
  };

  const items = typingText
    ? [...messages, { sender: "bot", message: typingText, typing: true }]
    : messages;

  return (
    <div className="flex flex-col h-full flex-1 shadow-2xl rounded-sm border-[1px] border-[#feca477a] bg-[var(--bg)] w-full">
      <Virtuoso
        className="my-5  py-3"
        data={items}
        followOutput="smooth"
        itemContent={(index, msg) => (
          <div className="space-y-6 mx-5 group relative" key={index}>
            {msg.sender === "user" ? (
              <div className="flex justify-end">
                <div className="relative max-w-2xl">
                  {editingIndex === index ? (
                    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-600">
                      <textarea
                        ref={textareaRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-transparent text-white resize-none outline-none"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit(editValue);
                          }
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                          className="h-8 px-3 text-xs"
                        >
                          <X size={14} className="mr-1" /> Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(editValue)}
                          className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                        >
                          <Check size={14} className="mr-1" /> Save & Submit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="me-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-gray-700 hover:bg-gray-600 text-white"
                          onClick={() => startEditing(index, msg.message)}
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-gray-700 hover:bg-gray-600 text-white"
                          onClick={() => copyToClipboard(msg.message)}
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                      <div className="whitespace-pre-wrap text-sm bg-gray-800 text-gray-200 rounded-2xl px-4 py-3 max-w-xs lg:max-w-md rounded-br-none">
                        {msg.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center max-w-2xl flex-row">
                <div className="bg-[var(--primary)] text-[var(--foreground)] rounded-2xl px-4 py-3 text-sm rounded-bl-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  >
                    {msg.message}
                  </ReactMarkdown>
                  {msg.typing && <span className="animate-pulse">▋</span>}
                </div>
                {!msg.typing && (
                  <div className="gap-1 flex ms-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-[var(--primary)] text-[var(--foreground)]"
                      onClick={() => copyToClipboard(msg.message)}
                    >
                      <Copy color="gray" size={12} />
                    </Button>
                    {index > 0 && items[index - 1].sender === "user" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-[var(--primary)] text-[var(--foreground)]"
                        onClick={() => regenerateResponse(index - 1)}
                        disabled={loading}
                      >
                        <RefreshCw color="gray" size={12} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      />
      <div className="p-4 border-t-[1px] border-[#feca477a] ">
        <div className="flex items-center gap-3  mx-auto">
          {editingIndex === null ? (
            <>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message"
                className="flex-1 rounded-sm py-4 px-4 bg-[var(--primary)] border-0 focus-visible:ring-2 focus-visible:ring-[#feca477a]"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="h-10 p-0 w-10 rounded-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-5 h-5 rotate-90 ms-1"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                )}
              </Button>
            </>
          ) : (
            <div className="w-full text-center text-sm text-gray-500">
              Editing message... Press Enter to save or Escape to cancel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
