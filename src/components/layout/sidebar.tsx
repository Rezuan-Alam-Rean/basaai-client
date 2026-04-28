import type { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return <aside className="w-full md:w-64 border-r border-border bg-card">{children}</aside>;
}
