"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export default function LoginPageClient() {
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
    <div className="flex flex-col  w-full max-w-2xl bg-[#0f0f12] border border-gray-800 p-6 rounded-lg shadow-2xl shadow-blue-500 hover:shadow-blue-900 mx-auto ">
      <label className="text-gray-200 mb-2">Username</label>
      <input
        className="bg-gray-900 text-gray-200 px-3 py-2 mb-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="text-gray-200 mb-2">Password</label>
      <input
        type="password"
        className="bg-gray-900 text-gray-200 px-3 py-2 mb-6 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2 justify-start">
        <button
          className="bg-gradient-to-r cursor-pointer rounded-lg from-purple-500 to-blue-500 text-white px-4 py-2 font-medium hover:opacity-90 transition"
          onClick={() => login(username, password)}
        >
          Login
        </button>
        <button
          className="bg-gradient-to-r rounded-lg cursor-pointer from-purple-500 to-blue-500 text-white px-4 py-2 font-medium hover:opacity-90 transition"
          onClick={() => signup(username, password)}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
