import type { FilterChipProps } from "~/type/restaurantType";
import "./filterChip.css";

export default function FilterChip({ active, label, onClick }: FilterChipProps) {
  return (
    <button
      className={`tt-chip ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
