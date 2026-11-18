import type { Metadata } from "next";
import { HeritageMap } from "@/components/map/HeritageMap";

export const metadata: Metadata = {
  title: "Explore Map",
  description:
    "An interactive map of Ward 16's cultural heritage sites — discover, explore, and collect badges.",
};

export default function MapPage() {
  return <HeritageMap />;
}
