import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "Ward 16 Heritage | A living archive",
    template: "%s | Ward 16 Heritage",
  },
  description: "A community-minded digital archive for selected cultural heritage locations in Ward 16.",
  openGraph: {
    title: "Ward 16 Heritage",
    description: "A living digital field guide to places, practices, and memories of Ward 16.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
