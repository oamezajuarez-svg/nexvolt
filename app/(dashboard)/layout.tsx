"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { AuthProvider } from "@/lib/auth-context";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="h-full">
      <Sidebar />
      <div
        className={`h-full flex flex-col transition-[padding-left] duration-300 ease-in-out ${
          collapsed ? "pl-16" : "pl-64"
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </AuthProvider>
  );
}
