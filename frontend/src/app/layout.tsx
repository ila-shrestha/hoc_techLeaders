import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/i18n/language";
import { HeritageChatbot } from "@/components/chat/HeritageChatbot";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ward 16 Heritage — Preserving Our Cultural Legacy",
    template: "%s | Ward 16 Heritage",
  },
  description:
    "Discover, document, and celebrate the cultural heritage sites of Ward 16 — temples, traditions, and the stories of our community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <HeritageChatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
