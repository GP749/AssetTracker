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
          html, body { background: white !important; }
          .no-print { display: none !important; }
          .label-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>

      <div className="mx-auto max-w-md space-y-4">
        <div className="no-print flex items-center justify-between">
          <Link
            href={`/tools/${tool.id}`}
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to tool
          </Link>
          <PrintButton label="Print label" />
        </div>

        <div className="label-card rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 dark:border-zinc-700">
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
              <div className="truncate text-[7pt] uppercase tracking-wide text-zinc-600">
                {tool.category}
              </div>
            </div>
          </div>
        </div>

        <div className="no-print rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <div>
            QR encodes:{" "}
            <code className="break-all rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
              {targetUrl}
            </code>
          </div>
          <div className="mt-1">
            Change the base URL by editing <code>APP_BASE_URL</code> in{" "}
            <code>.env</code> and restarting the dev server.
          </div>
        </div>
      </div>
    </>
  );
}
