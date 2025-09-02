"use client";

import React, { useState, useEffect } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (data.error) {
        console.error("Error from API:", data.error);
        return;
      }

      // اضافه کردن پیام کاربر
      setChatLog((prev) => [...prev, { user: input, bot: "" }]);

      // شروع تایپ متن ربات
      setTypingIndex(chatLog.length); // اندیس پیام جدید
      typeBotMessage(data.reply, chatLog.length);

      setInput("");
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // تابع نمایش حرف به حرف
  function typeBotMessage(message: string, index: number) {
    let i = 0;
    const interval = setInterval(() => {
      setChatLog((prev) => {
        const newLog = [...prev];
        newLog[index] = {
          ...newLog[index],
          bot: (newLog[index]?.bot || "") + message[i],
        };
        return newLog;
      });

      i++;
      if (i >= message.length) {
        clearInterval(interval);
        setTypingIndex(null);
      }
    }, 40); // سرعت تایپ (می‌تونی تغییر بدی)
  }

  return (
    <div className="flex flex-col h-[82vh] max-w-2xl mx-auto bg-[#0f0f12] border border-gray-800 rounded-2xl shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent my-5">
        {chatLog.map((msg, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex flex-col">
              <div className="flex justify-end">
                <div className="bg-gray-800 text-gray-200 rounded-br-none max-w-xs px-4 py-2 rounded-2xl text-sm">
                  {msg.user}
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-xs px-4 py-2 rounded-2xl text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-bl-none whitespace-pre-wrap">
                {msg.bot}
                {typingIndex === index && (
                  <span className="animate-pulse">▋</span>
                )}
              </div>
            </div>
          </div>
        ))}
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
