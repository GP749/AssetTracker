import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PrintButton } from "@/components/PrintButton";

export default async function ToolLabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await prisma.tool.findUnique({
    where: { id },
    select: { id: true, name: true, category: true },
  });
  if (!tool) notFound();

  const base = (process.env.APP_BASE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
  const targetUrl = `${base}/tools/${tool.id}`;

  return (
    <>
      <style>{`
        @page { size: 60mm 40mm; margin: 2mm; }
        @media print {
          html, body { background: white !important; color: black !important; }
          html { background-image: none !important; }
          .no-print { display: none !important; }
          .label-card {
            border: none !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
          }
          .label-card * { color: black !important; }
        }
      `}</style>

      <div className="mx-auto max-w-md space-y-5">
        <div className="no-print flex items-center justify-between">
          <Link
            href={`/tools/${tool.id}`}
            className="text-sm text-zinc-400 hover:text-zinc-100"
          >
            ← Back to tool
          </Link>
          <PrintButton label="◳ Print label" />
        </div>

        <div className="label-card rounded-xl border border-white/10 bg-white p-3 text-zinc-900">
          <div className="flex items-center gap-3">
            <img
              src={`/api/qr/${tool.id}`}
              alt={`QR code for ${tool.name}`}
              width={140}
              height={140}
              className="h-[36mm] w-[36mm] flex-none"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10pt] font-semibold leading-tight">
                {tool.name}
              </div>
              <div className="truncate font-mono text-[7pt] uppercase tracking-wide text-zinc-600">
                {tool.category}
              </div>
            </div>
          </div>
        </div>

        <div className="no-print rounded-lg border border-white/5 bg-white/[0.02] p-3 font-mono text-[11px] text-zinc-400">
          <div>
            <span className="text-zinc-500">qr.encodes</span>{" "}
            <span className="break-all text-blue-300">{targetUrl}</span>
          </div>
          <div className="mt-1.5 text-zinc-500">
            change via <span className="text-zinc-300">APP_BASE_URL</span> in{" "}
            <span className="text-zinc-300">.env</span>, restart dev server.
          </div>
        </div>
      </div>
    </>
  );
}
