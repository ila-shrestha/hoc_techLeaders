import { MapPin, Play, Quote } from "lucide-react";
import type { HeritageSite } from "@/lib/heritage-data";

export function VideoPlaceholder({ siteName }: { siteName: string }) {
  return (
    <div className="video-placeholder" role="img" aria-label={`Explanatory video placeholder for ${siteName}`}>
      <div className="video-orbit" aria-hidden="true"><Play size={20} fill="currentColor" /></div>
      <div>
        <span className="eyebrow light">Coming in the next chapter</span>
        <h3>An explanatory video for {siteName}</h3>
        <p>Field footage and community voices will be added after filming and permissions are confirmed.</p>
      </div>
      <span className="video-caption">Video placeholder · documentation pending</span>
    </div>
  );
}

export function LocationPanel({ site }: { site: HeritageSite }) {
  return (
    <div className="location-panel">
      <div className="location-icon"><MapPin size={20} /></div>
      <div>
        <span className="eyebrow">Location note</span>
        <h3>{site.location}</h3>
        <p>{site.visitorNote}</p>
      </div>
    </div>
  );
}

export function PullQuote({ children }: { children: React.ReactNode }) {
  return <blockquote className="pull-quote"><Quote size={22} /><p>{children}</p></blockquote>;
}
