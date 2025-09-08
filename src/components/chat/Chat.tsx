"use client";

import { useState, useEffect } from "react";
import { ChatProvider } from "@/src/context/ChatContext";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { Button } from "@/src/theme/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/theme/ui/sheet";
import { Menu } from "lucide-react";

export default function ChatPage() {
  const userId = "user-123";
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <ChatProvider userId={userId}>
      <div className="flex gap-3 p-3 h-[calc(100vh-80px)]">
        <div className="hidden md:block w-1/5">
          <ChatSidebar />
        </div>

        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="fixed top-24 left-5 z-40 md:hidden bg-[#1A1C1E] border-0"
              >
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 p-0 bg-[#1A1C1E] border-r border-[#FECB47] animate-in fade-in-90 duration-700"
            >
              <ChatSidebar />
            </SheetContent>
          </Sheet>
        )}

        <div className="w-full md:w-4/5">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
