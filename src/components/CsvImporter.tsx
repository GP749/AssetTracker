"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { importToolsCSV } from "@/lib/actions/import";

type PreviewRow = {
  lineNo: number;
  name: string;
  category: string;
  location: string;
  description: string;
  valid: boolean;
};

export function CsvImporter() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreview(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        if (results.errors.length > 0) {
          const er = results.errors[0];
          setError(`Parse error: ${er.message}`);
          return;
        }
        const rows: PreviewRow[] = results.data.map((r, i) => {
          const name = (r.name ?? "").toString().trim();
          const category = (r.category ?? "").toString().trim();
          return {
            lineNo: i + 2,
            name,
            category,
            location: (r.location ?? "").toString().trim(),
            description: (r.description ?? "").toString().trim(),
            valid: Boolean(name && category),
          };
        });
        setPreview(rows);
      },
    });
  };

  const reset = () => {
    setPreview(null);
    setError(null);
    setFilename("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const validCount = preview?.filter((r) => r.valid).length ?? 0;
  const invalidCount = (preview?.length ?? 0) - validCount;

  return (
    <div className="space-y-4">
      {!preview && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <label className="block">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-medium text-zinc-200">
                CSV file
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                columns: name, category, location, description
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={onFile}
              className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-100 hover:file:bg-white/[0.1]"
            />
            <div className="mt-2 font-mono text-[11px] text-zinc-500">
              <span className="text-zinc-400">name</span> and{" "}
              <span className="text-zinc-400">category</span> are required.{" "}
              <span className="text-zinc-400">location</span> and{" "}
              <span className="text-zinc-400">description</span> are optional.
            </div>
          </label>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {preview && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="font-mono text-[11px] text-zinc-400">
              <span className="text-zinc-100">{filename}</span> ·{" "}
              <span className="text-emerald-300 num">{validCount}</span> valid
              {invalidCount > 0 && (
                <>
                  {" · "}
                  <span className="text-red-300 num">{invalidCount}</span>{" "}
                  invalid
                </>
              )}
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              Choose a different file
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <tr className="border-b border-white/5">
                  <th className="px-3 py-2 font-normal">#</th>
                  <th className="px-3 py-2 font-normal">name</th>
                  <th className="px-3 py-2 font-normal">category</th>
                  <th className="px-3 py-2 font-normal">location</th>
                  <th className="px-3 py-2 font-normal">description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {preview.slice(0, 50).map((r) => (
                  <tr
                    key={r.lineNo}
                    className={r.valid ? "" : "bg-red-500/[0.06]"}
                  >
                    <td className="px-3 py-1.5 font-mono text-xs num text-zinc-500">
                      {r.lineNo}
                    </td>
                    <td
                      className={`px-3 py-1.5 ${r.name ? "text-zinc-100" : "text-red-300"}`}
                    >
                      {r.name || "— missing —"}
                    </td>
                    <td
                      className={`px-3 py-1.5 ${r.category ? "text-zinc-200" : "text-red-300"}`}
                    >
                      {r.category || "— missing —"}
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs text-zinc-400">
                      {r.location || "—"}
                    </td>
                    <td className="px-3 py-1.5 text-xs text-zinc-400">
                      {r.description || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 50 && (
              <div className="border-t border-white/5 px-3 py-2 text-xs text-zinc-500">
                showing first 50 of {preview.length} rows
              </div>
            )}
          </div>

          {invalidCount > 0 && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              Fix or remove the {invalidCount} invalid row(s) and re-upload —
              import is blocked while any row is missing a name or category.
            </div>
          )}

          {invalidCount === 0 && (
            <form action={importToolsCSV}>
              <input
                type="file"
                name="file"
                ref={(el) => {
                  // Attach the chosen file from the visible input into the
                  // submit-form's hidden input via FileList swap.
                  if (el && fileRef.current?.files?.[0]) {
                    const dt = new DataTransfer();
                    dt.items.add(fileRef.current.files[0]);
                    el.files = dt.files;
                  }
                }}
                className="hidden"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_8px_28px_-8px_rgba(59,130,246,0.6)] transition hover:bg-blue-500 active:translate-y-px"
              >
                ▸ Import {validCount} tool{validCount === 1 ? "" : "s"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
