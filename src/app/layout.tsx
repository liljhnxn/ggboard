import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GGBoard | On-Chain Gaming Scoreboard & Leaderboard",
  description:
    "Track your victories, record your matches, and climb the leaderboard. Your gaming achievements, permanently recorded on-chain on Botchain Mainnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0a0c10] text-[#f3f4f6] antialiased selection:bg-[#ff6200] selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
