import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { formatDateTime } from "@/lib/format";
import { getCurrentMemberId } from "@/lib/session";

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tool, currentMemberId] = await Promise.all([
    prisma.tool.findUnique({
      where: { id },
      include: {
        checkouts: {
          orderBy: { checkedOutAt: "desc" },
          include: { member: true },
        },
      },
    }),
    getCurrentMemberId(),
  ]);
  if (!tool) notFound();

  const open = tool.checkouts.find((c) => c.returnedAt === null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          ← Back to tools
        </Link>
        <Link
          href={`/tools/${tool.id}/label`}
          className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-blue-500/40 hover:bg-white/[0.05] hover:text-white"
        >
          ◳ Print QR label →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-zinc-900 to-zinc-950">
          {tool.photoUrl ? (
            <Image
              src={tool.photoUrl}
              alt={tool.name}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                no.photo
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
            {tool.category}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{tool.name}</h1>
          <div>
            <StatusBadge status={tool.status} size="md" />
          </div>
          {tool.description && (
            <p className="text-zinc-300/90 leading-relaxed">
              {tool.description}
            </p>
          )}

          {open && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.08] p-3 text-sm text-amber-200">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300/80">
                currently.with
              </span>
              <div className="mt-1">
                <strong className="text-amber-100">{open.member.name}</strong>{" "}
                <span className="text-amber-300/80">
                  since {formatDateTime(open.checkedOutAt)}
                </span>
              </div>
              {open.checkoutNote && (
                <div className="mt-1.5 text-amber-200/80">
                  &ldquo;{open.checkoutNote}&rdquo;
                </div>
              )}
            </div>
          )}

          <div className="pt-1">
            <CheckoutPanel
              toolId={tool.id}
              status={tool.status}
              hasMember={Boolean(currentMemberId)}
              currentHolderName={open?.member.name}
              isCurrentMemberHolder={open?.memberId === currentMemberId}
            />
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
            history.log
          </h2>
          <span className="num text-xs text-zinc-500">
            {tool.checkouts.length} entr
            {tool.checkouts.length === 1 ? "y" : "ies"}
          </span>
        </div>
        {tool.checkouts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
            no checkouts yet
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] text-left font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <tr>
                  <th className="px-3 py-2.5 font-normal">member</th>
                  <th className="px-3 py-2.5 font-normal">out</th>
                  <th className="px-3 py-2.5 font-normal">in</th>
                  <th className="px-3 py-2.5 font-normal">note</th>
                  <th className="px-3 py-2.5 font-normal">condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tool.checkouts.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5 text-zinc-100">
                      {c.member.name}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap num text-zinc-300">
                      {formatDateTime(c.checkedOutAt)}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap num">
                      {c.returnedAt ? (
                        <span className="text-zinc-300">
                          {formatDateTime(c.returnedAt)}
                        </span>
                      ) : (
                        <span className="text-amber-300">still out</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-300">
                      {[c.checkoutNote, c.returnNote]
                        .filter(Boolean)
                        .join(" → ") || (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-300">
                      {c.returnCondition ?? (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
