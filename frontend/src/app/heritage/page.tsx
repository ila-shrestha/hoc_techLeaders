import type { Metadata } from "next";
import { ExploreHeritageView } from "@/components/heritage/ExploreHeritageView";

export const metadata: Metadata = {
  title: "Explore Heritage",
  description:
    "Discover the cultural heritage sites of Ward 16 — documented temples, traditions, and stories.",
};

export default function HeritagePage() {
  return <ExploreHeritageView />;
}
