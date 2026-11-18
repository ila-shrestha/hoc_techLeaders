import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteBySlug, heritageSites } from "@/data/heritage";
import { getHeritageDetail } from "@/data";
import { HeritageDetailClient } from "@/components/heritage/detail/HeritageDetailClient";

export function generateStaticParams() {
  return heritageSites.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/heritage/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) return {};
  return {
    title: site.name,
    description: site.summary ?? `Learn about ${site.name} in Ward 16.`,
  };
}

export default async function HeritageDetailPage({
  params,
}: PageProps<"/heritage/[slug]">) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) notFound();

  const detail = getHeritageDetail(slug);

  return <HeritageDetailClient site={site} detail={detail} />;
}
