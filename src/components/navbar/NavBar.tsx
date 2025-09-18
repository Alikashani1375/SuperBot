"use client";
import React, { useState } from "react";
import Link from "next/link";
import ThemeChangerBtn from "../utils/ThemeChangerBtn";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/theme/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/src/theme/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/src/lib/utils";

const items = [
  { name: "Home", link: "/" },
  { name: "Chat", link: "/" },
  { name: "About", link: "/" },
  { name: "Sign In", link: "/" },
];

export function NavBar() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b-[1px] border-[#feca477a] bg-[var(--bg)]">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={128}
            height={32}
            className={cn("w-32 mb-[2px]", theme === "light" && "invert")}
          />
          <div className="text-sm text-nowrap lg:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FDE047] to-[#FDB447]">
            AI Assistant
          </div>
          <ThemeChangerBtn />
        </div>

        <div className="hidden md:flex gap-6">
          {items.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="py-2 px-3 rounded-md text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 "
            >
              {item.name}
            </Link>
          ))}
          <Button
            className="text-black bg-gray-200 text-sm !border-0"
            onClick={logout}
          >
            Logout
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-transparent border-gray-600 p-2"
              >
                <Menu className="h-5 w-5 text-[var(--foreground)]" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-[var(--bg1)] border-r border-[#feca477a]"
            >
              <div className="flex flex-col space-y-8 mt-10">
                {items.map((item, index) => (
                  <SheetClose asChild key={index}>
                    <Button
                      className="py-2 px-3 rounded-md text-lg font-semibold bg-[var(--primary)] transition-colors duration-200 "
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Button>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    className="bg-[var(--bg1)] !border-0 w-full justify-center text-lg py-2 px-3 h-auto"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
