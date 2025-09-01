"use client";

import { useState } from "react";
import { NavBar } from "./api/chat/components/Navbar/page";
import Chat from "./api/chat/components/chat/Chat";

export default function page() {
  return (
    <div>
      <Chat />
    </div>
  );
}
