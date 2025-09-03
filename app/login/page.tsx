"use client";

import { Suspense } from "react";
import LoginPageClient from "../../components/login/Login";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
