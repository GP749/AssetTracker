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
      <div
        id={ELEMENT_ID}
        className="aspect-square w-full max-w-md overflow-hidden rounded-lg border border-zinc-300 bg-black dark:border-zinc-700"
      />
      {stage === "starting" && (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Starting camera…
        </div>
      )}
      {stage === "scanning" && (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Point at a tool&apos;s QR code.
        </div>
      )}
      {stage === "error" && error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}

function extractToolId(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const pathMatch = trimmed.match(/\/tools\/([a-zA-Z0-9_-]+)/);
  if (pathMatch) return pathMatch[1];
  // Bare CUID-looking id (no slashes, reasonable length)
  if (/^[a-zA-Z0-9_-]{8,}$/.test(trimmed)) return trimmed;
  return null;
}
