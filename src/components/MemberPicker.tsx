"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "assetTracker.memberId";
const COOKIE_NAME = "memberId";

type Member = { id: string; name: string };

export function MemberPicker({
  members,
  initial,
}: {
  members: Member[];
  initial: string;
}) {
  const [memberId, setMemberId] = useState(initial);
  const router = useRouter();

  // Reconcile from localStorage on first mount in case the cookie was cleared.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? "";
    if (stored && stored !== initial) {
      setMemberId(stored);
      document.cookie = `${COOKIE_NAME}=${stored}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    } else if (initial) {
      localStorage.setItem(STORAGE_KEY, initial);
    }
  }, [initial, router]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setMemberId(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
      document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    }
    router.refresh();
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-zinc-500 sm:inline dark:text-zinc-400">
        You:
      </span>
      <select
        value={memberId}
        onChange={onChange}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
      >
        <option value="">Who are you?</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </label>
  );
}
