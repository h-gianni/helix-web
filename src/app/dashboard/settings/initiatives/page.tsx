// app/dashboard/settings/initiatives/page.tsx
"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { InitiativesSection } from "./_components/_initiativesSection";

export default function InitiativesSettingsPage() {
  const breadcrumbItems = [
    { label: "Settings", href: "/dashboard/settings" },
    { label: "Initiatives" },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <h1 className="text-display-1">Initiatives</h1>
      <InitiativesSection onUpdate={() => {}} />
    </>
  );
}