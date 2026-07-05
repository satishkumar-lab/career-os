import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerOS",
  description: "Your personal career dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      // DarkModeToggle applies the "dark" class to this element imperatively
      // (via a client-side effect, after reading localStorage/matchMedia), so
      // its class list is expected to change outside of React's render
      // output. This keeps React from ever warning about that intentional,
      // client-only mutation.
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
