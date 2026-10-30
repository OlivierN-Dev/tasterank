import type { TabButtonProps } from "~/type/restaurantType";
import "./tabButton.css";

export default function TabButton({ active, count, label, onClick }: TabButtonProps) {
  return (
    <button className={active ? "active" : ""} onClick={onClick} aria-pressed={active}>
      {label}<span>{count}</span>
    </button>
  );
}
