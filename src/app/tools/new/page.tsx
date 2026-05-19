import Link from "next/link";
import { createTool } from "@/lib/actions/tools";

export default function NewToolPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to tools
        </Link>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Add a tool</h1>

      <form
        action={createTool}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block">
          <div className="mb-1 text-sm font-medium">Name</div>
          <input
            name="name"
            required
            autoFocus
            placeholder="e.g. DeWalt Drill"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="block">
          <div className="mb-1 text-sm font-medium">Category</div>
          <input
            name="category"
            required
            placeholder="e.g. Power Tools"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="block">
          <div className="mb-1 text-sm font-medium">Description</div>
          <textarea
            name="description"
            rows={3}
            placeholder="Optional"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="block">
          <div className="mb-1 text-sm font-medium">Photo</div>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200"
          />
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Optional. JPG, PNG, WEBP, or GIF. Max 8 MB.
          </div>
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Save tool
          </button>
          <Link
            href="/"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
