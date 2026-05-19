import Link from "next/link";
import Image from "next/image";
import type { ToolStatus } from "@/generated/prisma/enums";
import { StatusBadge } from "./StatusBadge";

type Props = {
  id: string;
  name: string;
  category: string;
  photoUrl: string | null;
  status: ToolStatus;
  location?: string | null;
  currentHolder?: string | null;
  overdue?: boolean;
  daysOut?: number;
};

export function ToolCard({
  id,
  name,
  category,
  photoUrl,
  status,
  location,
  currentHolder,
  overdue,
  daysOut,
}: Props) {
  return (
    <Link
      href={`/tools/${id}`}
      className={`group relative overflow-hidden rounded-xl border transition ${
        overdue
          ? "border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.25),0_8px_24px_-8px_rgba(0,0,0,0.6)]"
          : "border-white/5 hover:border-blue-500/40 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_8px_24px_-8px_rgba(0,0,0,0.6)]"
      } bg-white/[0.02] hover:bg-white/[0.04]`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              no.photo
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
        {overdue && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-red-200 backdrop-blur">
              <span className="h-1 w-1 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]" />
              overdue · {daysOut}d
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="truncate">{category}</span>
          {location && (
            <span className="shrink-0 text-zinc-600">▸ {location}</span>
          )}
        </div>
        <div className="mt-0.5 truncate text-sm font-medium text-zinc-100 transition-colors group-hover:text-white">
          {name}
        </div>
        {status === "CHECKED_OUT" && currentHolder && (
          <div
            className={`mt-1 truncate text-xs ${
              overdue ? "text-red-300" : "text-amber-300/90"
            }`}
          >
            ▸ with {currentHolder}
          </div>
        )}
      </div>
    </Link>
  );
}
