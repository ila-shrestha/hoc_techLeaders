"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export function ExploreGame() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="fixed inset-0 z-40 bg-[#1a0d0d]">
      {/* slim return bar */}
      <div className="absolute left-3 top-3 z-50 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-[#F7F0E3]/25 bg-[#1a0d0d]/80 px-3.5 py-2 text-xs font-semibold text-[#F7F0E3] backdrop-blur transition-colors hover:bg-[#1a0d0d]"
        >
          <ArrowLeft size={13} />
          Ward 16 Heritage
        </Link>
      </div>

      {!loaded && !failed && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F7F0E3]/20 border-t-[#F2C14E]" />
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#F7F0E3]/60">
            Entering Kathmandu Galli…
          </p>
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="font-display text-xl text-[#F7F0E3]">The game could not be loaded</p>
          <p className="max-w-sm text-sm text-[#F7F0E3]/60">
            The 3D experience failed to start on this device. You can still browse all heritage sites.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setFailed(false); setLoaded(false); window.location.reload(); }}
              className="rounded-full bg-[#F7F0E3] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#830000]"
            >
              Retry
            </button>
            <Link
              href="/heritage"
              className="rounded-full border border-[#F7F0E3]/35 px-5 py-2.5 text-xs font-semibold text-[#F7F0E3]"
            >
              Browse heritage
            </Link>
          </div>
        </div>
      )}

      <iframe
        src="/explore/index.html"
        title="Kathmandu Galli — Ward 16 Heritage Game"
        className="h-full w-full border-0"
        allow="fullscreen; gamepad"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
