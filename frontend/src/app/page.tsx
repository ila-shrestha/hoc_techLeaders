import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AboutWard } from "@/components/home/AboutWard";
import { HeritageShowcase } from "@/components/home/HeritageShowcase";
import { HeritageVideo } from "@/components/home/HeritageVideo";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutWard />
      <HeritageShowcase />
      <HeritageVideo />
    </>
  );
}
