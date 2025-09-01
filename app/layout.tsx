import type { Metadata } from "next";

import "./globals.css";
import { NavBar } from "./components/Navbar/NavBar";

export const metadata: Metadata = {
  title: "SuperBot",
  description: "Designed by Ali Kashani",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-[#0f0f12] text-gray-200">
        <header className="shadow-lg shadow-black/30">
          <NavBar />
        </header>
        <main className="flex-1 container mx-auto px-6 py-6">{children}</main>
        <footer className="bg-[#111114] py-4 text-center text-xs text-gray-500 border-t border-gray-800">
          © {new Date().getFullYear()} SuperBot. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
