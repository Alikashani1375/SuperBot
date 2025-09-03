"use client";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";

export default function ChatSidebar() {
  const {
    conversations,
    setActiveConversation,
    createConversation,
    renameConversation,
    deleteConversation,
    activeConversation,
  } = useChat();

  const [newChatInput, setNewChatInput] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");

  function handleCreateNew() {
    if (!newChatInput.trim()) return;
    createConversation(newChatInput.trim());
    setNewChatInput("");
    setCreatingNew(false);
  }

  function handleRename(id: string) {
    if (!renameInput.trim()) return;
    renameConversation(id, renameInput.trim());
    setRenamingId(null);
  }

  return (
    <div className="min-w-[320px] bg-gray-900 border-r h-[82vh] border-gray-800 flex flex-col p-4 rounded-2xl">
      {creatingNew ? (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newChatInput}
            onChange={(e) => setNewChatInput(e.target.value)}
            placeholder="Chat name..."
            className="flex-1 px-2 py-1 rounded bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={handleCreateNew}
            className="px-2 py-1 bg-purple-600 rounded text-white cursor-pointer"
          >
            Create
          </button>
          <button
            onClick={() => setCreatingNew(false)}
            className="px-2 py-1 bg-gray-700 rounded text-white"
          >
            X
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreatingNew(true)}
          className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded mb-2 cursor-pointer"
        >
          + New Chat
        </button>
      )}

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-800 rounded ${
              activeConversation === conv.id ? "bg-gray-800" : ""
            }`}
          >
            {renamingId === conv.id ? (
              <div className="flex gap-1 flex-1">
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="flex-1 px-1 py-0.5 rounded bg-gray-700 text-white focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleRename(conv.id)}
                  className="px-1 bg-purple-600 rounded text-white "
                >
                  Save
                </button>
                <button
                  onClick={() => setRenamingId(null)}
                  className="px-1 bg-gray-700 rounded text-white cursor-pointer"
                >
                  X
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setActiveConversation(conv.id)}
                  className="flex-1"
                >
                  {conv.title}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setRenamingId(conv.id);
                      setRenameInput(conv.title);
                    }}
                    className="px-1 bg-blue-500 rounded text-white text-xs cursor-pointer"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => deleteConversation(conv.id)}
                    className="px-1 bg-red-500 rounded text-white text-xs cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
