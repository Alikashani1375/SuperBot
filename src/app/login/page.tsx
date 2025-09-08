import LoginPage from "@/src/components/login/Login";
import { Suspense } from "react";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<p className="text-white">Loading...</p>}>
      <LoginPage />
    </Suspense>
  );
}
