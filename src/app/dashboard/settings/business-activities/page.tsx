"use client";

import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { ActivitiesSection } from "./_components/_activitiesSection";

export default function BusinessActivitiesSettingsPage() {
  return (
    <>
      <PageBreadcrumbs
        items={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Business Activities" },
        ]}
      />
      <main className="ui-layout-page-main">
        <ActivitiesSection onUpdate={() => {}} />
      </main>
    </>
  );
}
