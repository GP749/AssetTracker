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

  const me = members.find((m) => m.id === memberId);

  return (
    <label className="group flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-white/20">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          me
            ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
            : "bg-zinc-500"
        }`}
      />
      <span className="hidden text-zinc-500 sm:inline">
        {me ? "you" : "anon"}
      </span>
      <select
        value={memberId}
        onChange={onChange}
        className="appearance-none bg-transparent pr-1 text-sm text-zinc-100 focus:outline-none"
      >
        <option value="">— pick member —</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </label>
  );
}
