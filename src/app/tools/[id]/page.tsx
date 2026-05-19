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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to tools
        </Link>
        <Link
          href={`/tools/${tool.id}/label`}
          className="text-sm text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Print QR label →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {tool.photoUrl ? (
            <Image
              src={tool.photoUrl}
              alt={tool.name}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600">
              <span className="text-xs uppercase tracking-wide">No photo</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {tool.category}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{tool.name}</h1>
          <div>
            <StatusBadge status={tool.status} size="md" />
          </div>
          {tool.description && (
            <p className="text-zinc-700 dark:text-zinc-300">
              {tool.description}
            </p>
          )}

          {open && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100">
              Currently with{" "}
              <strong>{open.member.name}</strong> since{" "}
              {formatDateTime(open.checkedOutAt)}
              {open.checkoutNote && (
                <div className="mt-1 text-amber-800 dark:text-amber-200/90">
                  &ldquo;{open.checkoutNote}&rdquo;
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <CheckoutPanel
              toolId={tool.id}
              status={tool.status}
              hasMember={Boolean(currentMemberId)}
              currentHolderName={open?.member.name}
              isCurrentMemberHolder={
                open?.memberId === currentMemberId
              }
            />
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">History</h2>
        {tool.checkouts.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No checkouts yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Member</th>
                  <th className="px-3 py-2 font-medium">Out</th>
                  <th className="px-3 py-2 font-medium">In</th>
                  <th className="px-3 py-2 font-medium">Note</th>
                  <th className="px-3 py-2 font-medium">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tool.checkouts.map((c) => (
                  <tr key={c.id}>
                    <td className="px-3 py-2">{c.member.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatDateTime(c.checkedOutAt)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {c.returnedAt ? (
                        formatDateTime(c.returnedAt)
                      ) : (
                        <span className="text-amber-700 dark:text-amber-300">
                          still out
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {[c.checkoutNote, c.returnNote]
                        .filter(Boolean)
                        .join(" → ") || "—"}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {c.returnCondition ?? "—"}
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
