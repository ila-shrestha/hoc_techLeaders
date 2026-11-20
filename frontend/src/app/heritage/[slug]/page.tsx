import type { Metadata } from "next";
import { Suspense } from "react";
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

export default function HeritageDetailPage({
  params,
}: PageProps<"/heritage/[slug]">) {
  return (
    <Suspense fallback={null}>
      <HeritageDetail params={params} />
    </Suspense>
  );
}

async function HeritageDetail({
  params,
}: Pick<PageProps<"/heritage/[slug]">, "params">) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) notFound();

  const detail = getHeritageDetail(slug);

  return <HeritageDetailClient site={site} detail={detail} />;
}
