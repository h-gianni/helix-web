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
      <div className="ui-layout-page">
        {children}
      </div>
    </SidebarProvider>
  );
}
