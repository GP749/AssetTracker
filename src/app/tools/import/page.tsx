import Link from "next/link";
import { redirect } from "next/navigation";
import { CsvImporter } from "@/components/CsvImporter";
import { getCurrentMemberId } from "@/lib/session";

export const metadata = { title: "Import — Asset Tracker" };

export default async function ImportToolsPage() {
  if (!(await getCurrentMemberId())) redirect("/login?next=/tools/import");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back to tools
        </Link>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          tools.import
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Bulk-add tools from CSV
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upload a spreadsheet to add many tools at once. Photos can be added
          afterwards on each tool&apos;s edit page.
        </p>
      </div>

      <CsvImporter />

      <details className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200">
          ▸ Example CSV
        </summary>
        <pre className="mt-3 overflow-x-auto rounded-md bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-zinc-300">
          {`name,category,location,description
DeWalt 20V Drill,Power Tools,Cabinet B1,20V max XR brushless drill
Stanley Tape Measure,Hand Tools,Tool wall A,25ft FatMax
Fluke 117 Multimeter,Electrical,Drawer D2,True-RMS, leads included
Step Ladder 6ft,Access Equipment,Bay 3,Fiberglass type IA`}
        </pre>
      </details>
    </div>
  );
}
