import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { editTool, deleteTool } from "@/lib/actions/tools";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href={`/tools/${tool.id}`}
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          ← Back to {tool.name}
        </Link>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          tools.edit
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Edit tool
        </h1>
      </div>

      <form
        action={editTool}
        className="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
      >
        <input type="hidden" name="id" value={tool.id} />
        <Field label="Name">
          <input
            name="name"
            required
            defaultValue={tool.name}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category">
            <input
              name="category"
              required
              defaultValue={tool.category}
              className={inputCls}
            />
          </Field>
          <Field label="Location" hint="optional">
            <input
              name="location"
              defaultValue={tool.location ?? ""}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Description" hint="optional">
          <textarea
            name="description"
            rows={3}
            defaultValue={tool.description ?? ""}
            className={inputCls}
          />
        </Field>
        <Field
          label="Replace photo"
          hint="leave empty to keep current"
        >
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
            Save changes
          </button>
          <Link
            href={`/tools/${tool.id}`}
            className="rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      <form
        action={deleteTool}
        className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4"
      >
        <input type="hidden" name="id" value={tool.id} />
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400">
          danger.zone
        </div>
        <p className="mt-1 text-sm text-zinc-300">
          Permanently delete this tool and its entire checkout history.
        </p>
        <button
          type="submit"
          className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/20"
        >
          Delete tool
        </button>
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
