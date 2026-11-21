import type { Metadata } from "next";
import { ExploreGame } from "./ExploreGame";

export const metadata: Metadata = {
  title: "Explore — WARD16 Galli",
};

export default function ExplorePage() {
  return <ExploreGame />;
}
