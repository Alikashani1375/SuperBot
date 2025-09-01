import React from "react";
import Link from "next/link";

const items = [
  { name: "Home", link: "/" },
  { name: "Chat", link: "/chat" },
  { name: "About", link: "/about" },
  { name: "Sign In", link: "/signin" },
];

export function NavBar() {
  return (
    <nav className="w-full bg-[#111114] border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          SuperBot
        </div>

        <div className="flex gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
