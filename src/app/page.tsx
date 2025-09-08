"use client";

import Chat from "../components/chat/Chat";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavBar } from "../components/navbar/NavBar";

export default function Page() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push(
        `/login?backUrl=${encodeURIComponent(window.location.pathname)}`
      );
    }
  }, [loading, token, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  if (!token) return null;

  return (
    <div className="h-screen flex flex-col justify-between">
      <NavBar />
      <Chat />
      <div className="bg-[var(--bg)]  py-4 text-center text-xs text-gray-500 border-t-[1px] border-[#feca477a] ">
        © {new Date().getFullYear()} Finestel. All rights reserved.
      </div>
    </div>
  );
}
