import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-16 md:ml-60 pb-16 md:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
