"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language";
import { detailPhotos, type DetailPhoto } from "@/data/detailPhotos";
import { DetailHero } from "./DetailHero";
import { ContentSection } from "./ContentSection";
import { Gallery } from "./Gallery";
import { VideoSection } from "./VideoSection";
import { RelatedSites } from "./RelatedSites";
import { VoiceReader } from "./VoiceReader";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { HeritageDetail, HeritageSite, LocationInfo } from "@/data/types";

const ARTICLE_ID = "heritage-article";

export function HeritageDetailClient({
  site,
  detail,
}: {
  site: HeritageSite;
  detail?: HeritageDetail;
}) {
  const { lang, t } = useLanguage();

  const useNe = lang === "ne" && detail?.ne;
  const name = useNe ? detail.ne!.name : site.name;

  if (!detail) {
    return (
      <>
        <DetailHero site={site} />
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="relative mx-auto mb-8 aspect-[16/9] max-w-2xl overflow-hidden rounded-xl">
              <PlaceholderImage site={{ ...site, name }} />
            </div>
            <h2 className="font-display text-3xl font-semibold text-ink">
              {t.detail.documentationComingSoon}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {name} {t.detail.comingSoonBody}
            </p>
            <Link
              href="/heritage"
              className="mt-8 inline-block rounded-full bg-darkred px-7 py-3 text-sm font-semibold text-paper transition-colors hover:bg-maroon"
            >
              {t.detail.exploreOthers}
            </Link>
          </div>
        </section>
      </>
    );
  }

  const content = useNe ? detail.ne! : detail;
  const introduction = content.introduction;
  const sections = content.sections;
  const videos = content.videos;
  const location: LocationInfo = content.location;
  const references =
    useNe && detail.ne?.references ? detail.ne.references : detail.references;
  const reviewPending = useNe && detail.ne?.reviewPending;

  // Contextual photographs (English with Nepali caption fallback)
  const photos = detailPhotos[detail.slug];
  const localizePhoto = (p?: DetailPhoto): DetailPhoto | undefined =>
    p && useNe
      ? {
          ...p,
          alt: p.altNe ?? p.alt,
          caption: p.captionNe ?? p.caption,
        }
      : p;
  const introPhoto = localizePhoto(photos?.introduction);

  // Gallery: keep src from the English detail, overlay localized alt/caption
  const gallery = detail.gallery.map((g, i) => {
    const localized = content.gallery[i];
    return {
      src: g.src,
      alt: localized?.alt ?? g.alt,
      caption: localized?.caption ?? g.caption,
    };
  });

  return (
    <>
      <DetailHero site={site} detail={detail} />

      <nav className="border-b border-line bg-mist">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="whitespace-nowrap rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-darkred hover:text-darkred"
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      <article id={ARTICLE_ID} className="bg-paper py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10">
            <VoiceReader targetId={ARTICLE_ID} />
          </div>

          {reviewPending && (
            <p className="mb-8 max-w-3xl rounded-lg border border-line bg-mist px-4 py-3 text-sm text-ink-soft">
              {lang === "ne"
                ? "यो पृष्ठको नेपाली अनुवाद समीक्षाधीन छ।"
                : "The Nepali translation of this page is under review."}
            </p>
          )}

          <div className="max-w-3xl space-y-4">
            {introduction.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink">
                {p}
              </p>
            ))}
          </div>

          {introPhoto && (
            <figure className="mt-8 max-w-3xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line">
                <Image
                  src={introPhoto.src}
                  alt={introPhoto.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-soft">
                {introPhoto.caption}
              </figcaption>
            </figure>
          )}

          {sections.map((section) => (
            <ContentSection
              key={section.id}
              section={section}
              photo={localizePhoto(photos?.sections[section.id])}
            />
          ))}

          <section className="border-t border-line/70 py-10">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              {t.detail.location}
            </h2>
            <div className="mt-4 max-w-3xl space-y-2 text-base text-ink-soft">
              {location.landmark && <p>📍 {location.landmark}</p>}
              {location.address && <p>{location.address}</p>}
              {location.note && <p className="italic">{location.note}</p>}
            </div>
          </section>

          <section className="border-t border-line/70 py-10">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              {t.detail.references}
            </h2>
            <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 text-base text-ink-soft">
              {references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <Gallery detail={detail} images={gallery} />
      <VideoSection videos={videos} />
      <RelatedSites slugs={detail.relatedSlugs} />
    </>
  );
}
