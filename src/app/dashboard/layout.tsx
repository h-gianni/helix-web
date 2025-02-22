import React from "react";
import AppSidebar from "./_components/_app-side-bar";
import { SidebarProvider } from "@/components/ui/composite/Side-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="layout-page">
        {children}
      </div>
    </SidebarProvider>
  );
}
