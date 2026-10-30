import type { ReactNode } from "react";

export type ChildrenType = {
  children: ReactNode;
  side?: "left" | "right";
  isOpen?: boolean;
  size?: "default" | "wide" | "detail";
};