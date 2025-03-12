import React from "react";
import ConditionalSidebar from "./_components/conditional-sidebar";
import { SidebarProvider } from "@/components/ui/composite/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ConditionalSidebar />
      <main className="layout-page">
        {children}
      </main>
    </SidebarProvider>
  );
}