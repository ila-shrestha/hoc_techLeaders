import type { Metadata } from "next";
import { AboutView } from "@/components/home/AboutView";

export const metadata: Metadata = {
  title: "About Ward 16",
  description:
    "Learn about Ward 16 — its cultural identity, heritage sites, and community traditions.",
};

export default function AboutPage() {
  return <AboutView />;
}
