"use client";

import { useEffect, useState, useCallback } from "react";
import { clearToken, getToken, saveToken } from "../lib/authDB";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
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
    setLoading(false);
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    setLoading(true);
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
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setToken(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    };

    checkAuth();
  }, [login, signup, logout]);

  return { token, login, signup, logout, loading };
}
