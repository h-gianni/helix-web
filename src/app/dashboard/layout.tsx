import React from "react";
import AppSidebar from "./_component/_appSidebar";
import { SidebarProvider } from "@/components/ui/composite/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        {children}
      </main>
    </SidebarProvider>
  );
}
