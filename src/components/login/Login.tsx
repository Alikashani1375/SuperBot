"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import ThemeChangerBtn from "../utils/ThemeChangerBtn";
import Image from "next/image";
import { Button } from "@/src/theme/ui/button";
export default function LoginPage() {
  const { token, login, signup, loading } = useAuth();
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

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex items-center gap-2 mt-10 bg-[var(--primary)] p-2 rounded-sm">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={128}
          height={32}
          className="w-32 mb-[2px]"
        />
        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FDE047] to-[#FDB447]">
          Ai Assistant
        </div>
        <ThemeChangerBtn />
      </div>
      <div className="flex flex-col  w-full mt-10 max-w-2xl bg-[var(--primary)] border border-gray-800 p-6 rounded-sm mx-auto text-black">
        <label className="text-[var(--secondary)] mb-2">Username</label>
        <input
          className="bg-gray-900 text-gray-200 rounded-sm px-3 py-2 mb-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-[var(--secondary)] mb-2">Password</label>
        <input
          type="password"
          className="bg-gray-900 rounded-sm text-gray-200 px-3 py-2 mb-6 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2 justify-start">
          <Button
            className="cursor-pointer rounded-sm  px-4 py-2 font-medium transition bg-[var(--primary)] border-[1px] border-white text-white"
            onClick={() => login(username, password)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          <Button
            className="rounded-sm cursor-pointer   px-4 py-2 font-medium  transition bg-[var(--primary)] border-[1px] border-white text-white"
            onClick={() => signup(username, password)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
