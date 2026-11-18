import Image from "next/image";
import type { HeritageSite } from "@/data/types";

interface PlaceholderImageProps {
  site: Pick<HeritageSite, "name" | "imageAlt"> & { image?: string };
  className?: string;
  priority?: boolean;
}

/**
 * Renders a real photo when `image` is set, otherwise a warm
 * culturally-patterned placeholder. Swap in photography by adding
 * the path to the site's `image` field — no component changes needed.
 */
export function PlaceholderImage({
  site,
  className = "",
  priority = false,
}: PlaceholderImageProps) {
  if (site.image) {
    return (
      <Image
        src={site.image}
        alt={site.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority={priority}
      />
    );
  }

  const patternId = `pat-${site.name.replace(/\s+/g, "-")}`;

  return (
    <div
      role="img"
      aria-label={site.imageAlt}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-ink ${className}`}
    >
      {/* Nepali-inspired geometric motif (dhaka-style lattice) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M12 0 L24 12 L12 24 L0 12 Z" fill="none" stroke="#BC0202" strokeWidth="0.7" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            <path d="M12 6 L18 12 L12 18 L6 12 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative z-10 px-6 text-center">
        <p className="font-display text-lg italic text-paper/90 md:text-xl">
          {site.name}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-bright">
          Ward 16 Heritage
        </p>
      </div>
    </div>
  );
}
