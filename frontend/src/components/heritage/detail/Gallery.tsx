"use client";

import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/i18n/language";
import type { GalleryImage, HeritageDetail } from "@/data/types";

function GalleryTile({
  image,
  site,
}: {
  image: GalleryImage;
  site: HeritageDetail;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="relative aspect-[4/3]">
        {image.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        ) : (
          <PlaceholderImage site={{ ...site, imageAlt: image.alt }} />
        )}
      </div>
      {image.caption && (
        <figcaption className="px-4 py-3 text-sm text-ink-soft">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Gallery({
  detail,
  images,
}: {
  detail: HeritageDetail;
  images: GalleryImage[];
}) {
  const { lang } = useLanguage();
  const name = lang === "ne" && detail.ne ? detail.ne.name : detail.name;
  if (images.length === 0) return null;
  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={lang === "ne" ? "ग्यालेरी" : "Gallery"}
          title={`${lang === "ne" ? "चित्रहरूमा" : "In pictures"}: ${name}`}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, i) => (
            <GalleryTile key={i} image={image} site={detail} />
          ))}
        </div>
      </div>
    </section>
  );
}
