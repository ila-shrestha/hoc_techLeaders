import type { Metadata } from "next";
import { WorldIntro } from "@/components/world/WorldIntro";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return <WorldIntro />;
}
