"use client";

import { useSelection } from "./SelectionProvider";

export function SelectionCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { has, toggle, count } = useSelection();
  const selected = has(id);

  const onCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  // When at least one card is selected, treat a card click as a toggle
  // (instead of navigation) so multi-select feels natural.
  const onWrapperClick = (e: React.MouseEvent) => {
    if (count === 0) return; // normal navigation
    e.preventDefault();
    toggle(id);
  };

  return (
    <div
      onClick={onWrapperClick}
      className={`relative transition ${
        selected
          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#08080a] rounded-xl"
          : ""
      }`}
    >
      <button
        type="button"
        aria-label={selected ? "Deselect" : "Select"}
        onClick={onCheckboxClick}
        className={`absolute left-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-md border backdrop-blur transition ${
          selected
            ? "border-blue-400 bg-blue-500 text-white opacity-100"
            : "border-white/20 bg-black/40 text-transparent opacity-0 group-hover/grid:opacity-100 hover:opacity-100 hover:text-white/70"
        } ${count > 0 ? "opacity-100" : ""}`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.5]">
          <polyline points="3,8.5 6.5,12 13,4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {children}
    </div>
  );
}
