import type { ChildrenType } from "~/type/childrenType";
import "./aside.css";

export default function AsideView({
  children,
  side = "left",
  isOpen = true,
  size = "default",
}: ChildrenType) {
  return (
    <aside
      className={`aside aside--${side} aside--${size} ${isOpen ? "is-open" : "is-closed"}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {children}
    </aside>
  );
}