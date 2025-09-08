"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/src/theme/ui/button";

export default function ThemeChangerBtn() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      className="ms-5 w-20"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
