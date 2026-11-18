import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PointsBadge } from "@/components/points-badge";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "疑問ノート",
  description: "毎日の疑問 → 仮説 → 結果 を積み上げるノート",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} min-h-dvh bg-background font-sans antialiased`}>
        <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
            <Link href="/" className="font-semibold tracking-tight">
              疑問ノート
            </Link>
            <PointsBadge />
          </div>
        </header>
        <main className="mx-auto max-w-xl px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
