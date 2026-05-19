import Link from "next/link";
import { prisma } from "@/lib/db";
import { PrintButton } from "@/components/PrintButton";
import type { ToolStatus } from "@/generated/prisma/enums";

const VALID_STATUSES: ReadonlySet<ToolStatus> = new Set([
  "AVAILABLE",
  "CHECKED_OUT",
  "MAINTENANCE",
]);

export const metadata = { title: "Bulk labels — Asset Tracker" };

export default async function BulkLabelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const idsParam = typeof sp.ids === "string" ? sp.ids : "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const statusParam = typeof sp.status === "string" ? sp.status : "";
  const status = VALID_STATUSES.has(statusParam as ToolStatus)
    ? (statusParam as ToolStatus)
    : undefined;
  const category = typeof sp.category === "string" ? sp.category : "";
  const location = typeof sp.location === "string" ? sp.location : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const usingIds = ids.length > 0;

  const tools = await prisma.tool.findMany({
    where: usingIds
      ? { id: { in: ids } }
      : {
          ...(status ? { status } : {}),
          ...(category ? { category } : {}),
          ...(location ? { location } : {}),
          ...(q
            ? {
                OR: [
                  { name: { contains: q } },
                  { description: { contains: q } },
                ],
              }
            : {}),
        },
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true, location: true },
  });

  const base = (process.env.APP_BASE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 8mm; }
        @media print {
          html, body { background: white !important; color: black !important; }
          html { background-image: none !important; }
          .no-print { display: none !important; }
          main { max-width: none !important; padding: 0 !important; }
          .sheet { gap: 0 !important; }
          .label {
            border: 0.5pt dashed #cbd5e1 !important;
            background: white !important;
            color: black !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .label * { color: black !important; }
        }
      `}</style>

      <div className="space-y-4">
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
              ← Back to tools
            </Link>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
              labels.batch
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Print {tools.length} label{tools.length === 1 ? "" : "s"}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {usingIds
                ? `${tools.length} tool(s) by id`
                : "Matching the current filter"}
              {" · "}
              <span className="font-mono text-zinc-500">
                12 per A4 · 4×3 grid · cut along the dashed lines
              </span>
            </p>
          </div>
          <PrintButton label="◳ Print sheet" />
        </div>

        {tools.length === 0 ? (
          <div className="no-print rounded-xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-500">
            no tools match the current selection
          </div>
        ) : (
          <div className="sheet grid grid-cols-3 gap-2">
            {tools.map((t) => (
              <div
                key={t.id}
                className="label flex h-[67mm] w-full items-center gap-2 rounded-md border border-white/10 bg-white p-2 text-zinc-900"
              >
                <img
                  src={`/api/qr/${t.id}`}
                  alt={`QR for ${t.name}`}
                  width={180}
                  height={180}
                  className="h-[55mm] w-[55mm] flex-none"
                />
                <div className="min-w-0 flex-1 self-stretch overflow-hidden">
                  <div className="break-words text-[10pt] font-semibold leading-tight">
                    {t.name}
                  </div>
                  <div className="mt-1 truncate font-mono text-[7pt] uppercase tracking-wide text-zinc-600">
                    {t.category}
                  </div>
                  {t.location && (
                    <div className="mt-0.5 truncate font-mono text-[7pt] uppercase tracking-wide text-zinc-500">
                      ▸ {t.location}
                    </div>
                  )}
                  <div className="mt-2 truncate font-mono text-[6pt] text-zinc-400">
                    {base}/tools/{t.id.slice(0, 10)}…
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
