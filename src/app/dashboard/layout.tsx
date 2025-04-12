"use client";

import React from "react";
import ConditionalSidebar from "./components/conditional-sidebar";
import { SidebarProvider } from "@/components/ui/composite/Sidebar";
import { MobileBottomNav } from "./components/MobileNav";
import { useSetupStateSync } from '@/hooks/useSetupStateSync';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync setup state to cookies for middleware
  useSetupStateSync();
  
  return (
    <SidebarProvider>
      <ConditionalSidebar />
      <main className="layout-page">{children}</main>
      <div className="h-16 lg:hidden">
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}