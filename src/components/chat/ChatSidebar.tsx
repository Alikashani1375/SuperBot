"use client";
import { useChat } from "@/src/context/ChatContext";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/theme/ui/button";
import { Card, CardContent } from "@/src/theme/ui/card";
import { Input } from "@/src/theme/ui/input";
import { ScrollArea } from "@/src/theme/ui/scroll-area";
import { useState } from "react";

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
    <Card className="w-full  h-full flex flex-col rounded-none md:rounded-sm border-[1px] border-[#feca477a] bg-[var(--bg)] ">
      <CardContent className="flex flex-col flex-1 p-0 w-full">
        {creatingNew ? (
          <div className="flex gap-2 m-2">
            <Input
              placeholder="Chat name..."
              value={newChatInput}
              onChange={(e) => setNewChatInput(e.target.value)}
              className="flex-1 max-w-[180px]"
            />
            <Button
              onClick={handleCreateNew}
              variant="primary"
              className="border-0"
            >
              Create
            </Button>
            <Button onClick={() => setCreatingNew(false)} variant="destructive">
              X
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setCreatingNew(true)}
            variant="primary"
            className="mb-2 rounded-none h-[42px] w-full md:rounded-t-sm   bg-gradient-to-br from-[#FDE047] to-[#FDB447] text-sm font-bold text-[#1A1C1E] transition-all hover:from-[#FDB447] hover:to-[#FDE047]"
          >
            + New Chat
          </Button>
        )}

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className={cn(
                  "flex items-center justify-between rounded-none border-0 p-3 cursor-pointer",
                  activeConversation === conv.id
                    ? "bg-gray-200 dark:bg-neutral-700"
                    : ""
                )}
              >
                {renamingId === conv.id ? (
                  <div className="flex gap-4 flex-1">
                    <Input
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      autoFocus
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleRename(conv.id)}
                      size="sm"
                      variant="primary"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setRenamingId(null)}
                      size="sm"
                      className="bg-[var(--destructive)] text-white"
                    >
                      X
                    </Button>
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
                      <Button
                        onClick={() => {
                          setRenamingId(conv.id);
                          setRenameInput(conv.title);
                        }}
                        size="sm"
                        className="me-2"
                        variant="primary"
                      >
                        Rename
                      </Button>
                      <Button
                        onClick={() => deleteConversation(conv.id)}
                        size="sm"
                        className="bg-[var(--destructive)] text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
