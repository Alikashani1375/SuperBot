"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import ThemeChangerBtn from "../utils/ThemeChangerBtn";
import Image from "next/image";
import { Button } from "@/src/theme/ui/button";
import { Loader } from "lucide-react";

export default function LoginPage() {
  const { token, login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backUrl = searchParams.get("backUrl") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && token) {
      router.push(backUrl);
    }
  }, [loading, token, backUrl, router]);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") login(username, password);
      }}
    >
      <div className="flex items-center gap-3 mb-10">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={140}
          height={40}
          className="w-36"
        />
        <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          Ai Assistant
        </div>
        <ThemeChangerBtn />
      </div>

      <div className="w-full max-w-md bg-[var(--bg1)] border border-gray-700 rounded-sm shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-6">
          Welcome Back
        </h2>

        <label className="text-[var(--secondary)] text-sm mb-1 block">
          Username
        </label>
        <input
          className="w-full text-[var(--foreground)] bg-[var(--bg1)] rounded-sm px-4 py-2 mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-[var(--secondary)] text-sm mb-1 block">
          Password
        </label>
        <input
          type="password"
          className="w-full text-[var(--foreground)] bg-[var(--bg1)] rounded-sm px-4 py-2 mb-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <Button
            className="w-full rounded-sm px-4 py-2 font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:opacity-90 transition"
            onClick={() => login(username, password)}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
