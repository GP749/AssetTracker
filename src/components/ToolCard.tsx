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
  currentHolder?: string | null;
};

export function ToolCard({
  id,
  name,
  category,
  photoUrl,
  status,
  currentHolder,
}: Props) {
  return (
    <Link
      href={`/tools/${id}`}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition hover:border-blue-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_8px_24px_-8px_rgba(0,0,0,0.6)]"
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
      </div>
      <div className="px-3 py-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {category}
        </div>
        <div className="mt-0.5 truncate text-sm font-medium text-zinc-100 transition-colors group-hover:text-white">
          {name}
        </div>
        {status === "CHECKED_OUT" && currentHolder && (
          <div className="mt-1 truncate text-xs text-amber-300/90">
            ▸ with {currentHolder}
          </div>
        )}
      </div>
    </Link>
  );
}
