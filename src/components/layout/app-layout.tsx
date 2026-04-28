import type { ReactNode } from "react";

interface AppLayoutProps {
  sidebar?: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {sidebar}
      <section className="flex-1">{children}</section>
    </div>
  );
}
