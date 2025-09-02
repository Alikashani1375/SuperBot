"use client";

import { useEffect, useState } from "react";
import { clearToken, getToken, saveToken } from "../lib/authDB";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function checkAuth() {
      const savedToken = await getToken();
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    }
    checkAuth();
  }, [login, signup, logout]);

  async function login(username: string, password: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      await saveToken(data.token);
      setToken(data.token);
    }
  }

  async function signup(username: string, password: string) {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      await saveToken(data.token);
      setToken(data.token);
    }
  }

  async function logout() {
    await clearToken();
    setToken(null);
    router.push("/login");
  }

  return { token, login, signup, logout, loading };
}
