"use client";

import Chat from "./components/chat/Chat";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

export default function Page() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      // ریدایرکت به لاگین و پاس دادن backUrl
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
    <div className="h-screen">
      <Chat />
    </div>
  );
}
