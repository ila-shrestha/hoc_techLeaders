interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold uppercase tracking-[0.3em] ${
            dark ? "text-bright" : "text-darkred"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl leading-tight md:text-4xl lg:text-[2.75rem] ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed md:text-lg ${
            dark ? "text-paper/70" : "text-ink-soft"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
