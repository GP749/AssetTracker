import Link from "next/link";
import { createTool } from "@/lib/actions/tools";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

export default function NewToolPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          ← Back to tools
        </Link>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          tools.create
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Add a tool
        </h1>
      </div>

      <form
        action={createTool}
        className="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
      >
        <Field label="Name">
          <input
            name="name"
            required
            autoFocus
            placeholder="e.g. DeWalt Drill"
            className={inputCls}
          />
        </Field>
        <Field label="Category">
          <input
            name="category"
            required
            placeholder="e.g. Power Tools"
            className={inputCls}
          />
        </Field>
        <Field label="Description" hint="optional">
          <textarea
            name="description"
            rows={3}
            placeholder="Notes about this tool"
            className={inputCls}
          />
        </Field>
        <Field label="Photo" hint="optional · JPG/PNG/WEBP/GIF · 8 MB max">
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-100 hover:file:bg-white/[0.1]"
          />
        </Field>
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_16px_-4px_rgba(59,130,246,0.5)] hover:bg-blue-500"
          >
            Save tool
          </button>
          <Link
            href="/"
            className="rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}
