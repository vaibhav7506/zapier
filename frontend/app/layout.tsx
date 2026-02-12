import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zapier - Automate your work",
  description: "AI gives you automation superpowers. Pairing AI and Zapier helps you turn ideas into workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} overflow-x-hidden`}>{children}</body>
    </html>
  );
}