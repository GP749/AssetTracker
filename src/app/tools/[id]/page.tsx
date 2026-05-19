import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { MaintenancePanel } from "@/components/MaintenancePanel";
import { formatDateTime } from "@/lib/format";
import { getCurrentMemberId } from "@/lib/session";
import { isOverdue, daysSince, overdueDays } from "@/lib/overdue";

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
  const overdue = open ? isOverdue(open.checkedOutAt) : false;
  const daysOut = open ? daysSince(open.checkedOutAt) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back to tools
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/tools/${tool.id}/edit`}
            className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-blue-500/40 hover:bg-white/[0.05] hover:text-white"
          >
            ✎ Edit
          </Link>
          <Link
            href={`/tools/${tool.id}/label`}
            className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-blue-500/40 hover:bg-white/[0.05] hover:text-white"
          >
            ◳ Print QR label →
          </Link>
        </div>
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
          <div className="flex flex-wrap items-baseline gap-x-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="text-blue-400">{tool.category}</span>
            {tool.location && (
              <span className="text-zinc-500">▸ {tool.location}</span>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{tool.name}</h1>
          <div>
            <StatusBadge status={tool.status} size="md" />
          </div>
          {tool.description && (
            <p className="leading-relaxed text-zinc-300/90">
              {tool.description}
            </p>
          )}

          {open && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                overdue
                  ? "border-red-500/30 bg-red-500/[0.08] text-red-100"
                  : "border-amber-500/30 bg-amber-500/[0.08] text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                    overdue ? "text-red-300/80" : "text-amber-300/80"
                  }`}
                >
                  {overdue ? "overdue" : "currently.with"}
                </span>
                <span className="num text-[10px] text-zinc-400">
                  {daysOut}d out · max {overdueDays()}d
                </span>
              </div>
              <div className="mt-1">
                <strong
                  className={overdue ? "text-red-100" : "text-amber-100"}
                >
                  {open.member.name}
                </strong>{" "}
                <span
                  className={
                    overdue ? "text-red-300/80" : "text-amber-300/80"
                  }
                >
                  since {formatDateTime(open.checkedOutAt)}
                </span>
              </div>
              {open.checkoutNote && (
                <div
                  className={`mt-1.5 ${
                    overdue ? "text-red-200/80" : "text-amber-200/80"
                  }`}
                >
                  &ldquo;{open.checkoutNote}&rdquo;
                </div>
              )}
            </div>
          )}

          {tool.status === "MAINTENANCE" && (
            <MaintenancePanel
              toolId={tool.id}
              status={tool.status}
              reason={tool.maintenanceReason}
              startedAt={tool.maintenanceStartedAt}
            />
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

          {tool.status === "AVAILABLE" && (
            <MaintenancePanel toolId={tool.id} status={tool.status} />
          )}
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
                        <span
                          className={
                            isOverdue(c.checkedOutAt)
                              ? "text-red-300"
                              : "text-amber-300"
                          }
                        >
                          {isOverdue(c.checkedOutAt)
                            ? `overdue · ${daysSince(c.checkedOutAt)}d`
                            : "still out"}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-300">
                      {c.damageReported && (
                        <span className="mr-1 rounded border border-red-500/30 bg-red-500/10 px-1 py-px font-mono text-[9px] uppercase tracking-wider text-red-200">
                          damaged
                        </span>
                      )}
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
