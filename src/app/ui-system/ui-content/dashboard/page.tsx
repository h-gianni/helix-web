// File: app/ui-system/ui-content/dashboard/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import DashboardShowcase from "./Dashboard";

export default function DashboardShowcasePage() {
  return (
    <ShowcaseLayout
      title="Dashboard Components"
      description="Interactive dashboards for monitoring team performance and key metrics"
    >
      <DashboardShowcase />
    </ShowcaseLayout>
  );
}