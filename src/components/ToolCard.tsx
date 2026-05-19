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
      className="group block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600">
            <span className="text-xs uppercase tracking-wide">No photo</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {category}
        </div>
        <div className="mt-0.5 truncate font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-white">
          {name}
        </div>
        {status === "CHECKED_OUT" && currentHolder && (
          <div className="mt-1 truncate text-sm text-amber-700 dark:text-amber-300">
            With {currentHolder}
          </div>
        )}
      </div>
    </Link>
  );
}
