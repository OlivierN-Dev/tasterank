import type { SelectableChipProps } from "~/type/restaurantType";
import "./selectableChip.css";

export default function SelectableChip({
  children,
  selected,
  onClick,
  variant = "tag",
}: SelectableChipProps) {
  return (
    <button
      className={`restaurant-chip restaurant-chip--${variant}${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
