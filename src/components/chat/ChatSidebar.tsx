"use client";

import { useState, useEffect, useCallback } from "react";
import { useChat } from "@/src/context/ChatContext";
import { Input } from "@/src/theme/ui/input";
import { Button } from "@/src/theme/ui/button";
import { Trash2, Plus, Edit } from "lucide-react";
import { Conversation } from "@/src/hooks/useChatHistory";

export default function ChatSidebar() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    deleteConversation,
    renameConversation,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const debounce = useCallback(
    <T extends unknown[]>(func: (...args: T) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: T) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  const filterConversations = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setFilteredConversations(conversations);
        return;
      }

      const regex = new RegExp(term, "i");
      const filtered = conversations.filter(
        (conv) =>
          regex.test(conv.title) ||
          conv.messages.some((msg) => regex.test(msg.message))
      );

      setFilteredConversations(filtered);
    },
    [conversations]
  );

  const debouncedFilter = useCallback(
    debounce((term: string) => {
      filterConversations(term);
    }, 1000),
    [debounce, filterConversations]
  );

  useEffect(() => {
    debouncedFilter(searchTerm);
  }, [searchTerm, debouncedFilter]);

  useEffect(() => {
    filterConversations(searchTerm);
  }, [conversations, searchTerm, filterConversations]);

  const handleCreateConversation = async () => {
    if (newChatName.trim()) {
      await createConversation(newChatName.trim());
      setNewChatName("");
      setIsCreating(false);
    }
  };

  const startRename = (conv: Conversation) => {
    setIsRenaming(conv.id);
    setRenameValue(conv.title);
  };

  const saveRename = async (id: string) => {
    if (renameValue.trim()) {
      await renameConversation(id, renameValue);
    }
    setIsRenaming(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setIsRenaming(null);
    setRenameValue("");
  };

  return (
    <div className="w-full bg-[var(--bg)] border-[1px] border-[#feca477a] h-full flex flex-col">
      <div className="p-4 border-b border-[#feca477a]">
        {isCreating ? (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter chat name..."
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateConversation();
                if (e.key === "Escape") setIsCreating(false);
              }}
              className="w-full text-[var(--foreground)] bg-[var(--bg1)] border-gray-700 placeholder-gray-400 rounded-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateConversation}
                className="flex-1 bg-[var(--success)] hover:bg-[var(--success)]"
                disabled={!newChatName.trim()}
              >
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full bg-gradient-to-br from-[#FDE047] to-[#FDB447] text-sm font-bold text-[#1A1C1E] hover:from-[#FDB447] hover:to-[#FDE047]"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>
        )}
      </div>
      <div className="p-4 border-b border-[#feca477a]">
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg)] border-[var(--bg1)] text-[var(--foreground)] rounded-sm placeholder-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 rounded-sm mb-2 cursor-pointer transition-colors ${
                activeConversation === conv.id
                  ? "bg-[var(--bg1)] border-[1px] border-[#feca477a] "
                  : "bg-[var(--bg1)] "
              }`}
              onClick={() => setActiveConversation(conv.id)}
            >
              <div className="flex items-center justify-between">
                {isRenaming === conv.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(conv.id);
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="flex-1 h-8 bg-[var(--bg)] text-[var(--foreground)] border-[var(--bg1)] rounded-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => saveRename(conv.id)}
                      className="h-6 px-2 bg-[var(--success)] hover:bg-[var(--success)]"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelRename}
                      className="h-6 px-2 bg-[var(--destructive)] text-[var(--foreground)]"
                    >
                      ✗
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 truncate text-sm text-[var(--foreground)]">
                      {conv.title}
                    </div>
                    <div className="flex gap-1 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-xs bg-[var(--userchatbg)] text-[var(--userchat)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(conv);
                        }}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-xs bg-[var(--userchatbg)] text-[var(--userchat)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {conv.messages.length > 0 && (
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {conv.messages[conv.messages.length - 1].message.substring(
                    0,
                    50
                  )}
                  {conv.messages[conv.messages.length - 1].message.length >
                    50 && "..."}
                </div>
              )}
            </div>
          ))}

          {filteredConversations.length === 0 && searchTerm && (
            <div className="text-center text-gray-400 py-4">
              No conversations found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
