import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Activity, BarChart3, ClipboardList } from "lucide-react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "One Health Reporting",
  description:
    "A privacy-conscious One Health reporting and local risk-awareness MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen">
          <header className="border-b border-teal-900/10 bg-white/85 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-bold text-public-teal"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-soft-mint text-public-teal">
                  <Activity className="size-4" aria-hidden="true" />
                </span>
                One Health
              </Link>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link
                  href="/report"
                  className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-ink/75 transition hover:bg-soft-mint hover:text-public-teal"
                >
                  <ClipboardList className="size-4" aria-hidden="true" />
                  Report
                </Link>
                <Link
                  href="/dashboard"
                  className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-ink/75 transition hover:bg-soft-sky hover:text-public-blue"
                >
                  <BarChart3 className="size-4" aria-hidden="true" />
                  Dashboard
                </Link>
              </div>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
