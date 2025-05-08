"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ConditionalSidebar from "./components/conditional-sidebar";
import { SidebarProvider } from "@/components/ui/composite/Sidebar";
import { MobileBottomNav } from "./components/MobileNav";
import { useSetupStateSync } from "@/store/setup-store";
import { useSetupProgress } from "@/hooks/useSetupProgress";
import { useOrgSetup } from "@/store/org-store";
import PerformanceRatingModal from "@/app/dashboard/components/scoring/ScoringModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync setup state to cookies for middleware
  useSetupStateSync();

  // Get current pathname
  const pathname = usePathname();
  const { showMainDashboard } = useSetupProgress();
  // Check if path includes "onboarding"
  const isOnboarding = pathname?.includes("onboarding");

  return (
    <SidebarProvider>
      <ConditionalSidebar />
      <main
        className={showMainDashboard ? "layout-page dashboard" : "layout-page"}
      >
        {children}
      </main>
      <div className="h-16 lg:hidden">
        <MobileBottomNav />
      </div>
      <PerformanceRatingModal />
    </SidebarProvider>
  );
}
