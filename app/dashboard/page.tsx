"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { token, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;

  if (!token) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl">Welcome to Dashboard ✅</h1>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-4">
        Logout
      </button>
    </div>
  );
}
