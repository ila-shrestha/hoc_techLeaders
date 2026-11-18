export function ImageFrame({ src, alt, label, className = "" }: { src: string; alt: string; label?: string; className?: string }) {
  return (
    <figure className={`image-frame ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
      {label ? <figcaption>{label}</figcaption> : null}
    </figure>
  );
}
