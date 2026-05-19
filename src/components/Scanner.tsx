"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ELEMENT_ID = "asset-tracker-scanner";

type Stage = "idle" | "starting" | "scanning" | "error";

export function Scanner() {
  const router = useRouter();
  const scannerRef = useRef<{ stop?: () => Promise<void> }>({});
  const handledRef = useRef(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStage("starting");

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const html5 = new Html5Qrcode(ELEMENT_ID);
        scannerRef.current.stop = async () => {
          try {
            await html5.stop();
          } catch {
            // ignore
          }
          html5.clear();
        };

        await html5.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (handledRef.current) return;
            const toolId = extractToolId(decodedText);
            if (!toolId) return;
            handledRef.current = true;
            html5
              .stop()
              .catch(() => {})
              .finally(() => router.push(`/tools/${toolId}`));
          },
          () => {
            // Per-frame decode failures are noisy; ignore.
          },
        );
        if (!cancelled) setStage("scanning");
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error
            ? e.message
            : "Could not access the camera. On phones, the page must be served over HTTPS.",
        );
        setStage("error");
      }
    })();

    return () => {
      cancelled = true;
      scannerRef.current.stop?.();
    };
  }, [router]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          id={ELEMENT_ID}
          className="aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black"
        />
        {/* Corner brackets overlay */}
        <div className="pointer-events-none absolute inset-3">
          <Corner pos="top-0 left-0" rot="" />
          <Corner pos="top-0 right-0" rot="rotate-90" />
          <Corner pos="bottom-0 right-0" rot="rotate-180" />
          <Corner pos="bottom-0 left-0" rot="-rotate-90" />
        </div>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider">
        {stage === "starting" && (
          <span className="text-zinc-400">▸ starting camera…</span>
        )}
        {stage === "scanning" && (
          <span className="text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />{" "}
            ready · point at a label
          </span>
        )}
      </div>
      {stage === "error" && error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}

function Corner({ pos, rot }: { pos: string; rot: string }) {
  return (
    <div
      className={`absolute ${pos} ${rot} h-6 w-6 border-t-2 border-l-2 border-blue-400`}
    />
  );
}

function extractToolId(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const pathMatch = trimmed.match(/\/tools\/([a-zA-Z0-9_-]+)/);
  if (pathMatch) return pathMatch[1];
  if (/^[a-zA-Z0-9_-]{8,}$/.test(trimmed)) return trimmed;
  return null;
}
