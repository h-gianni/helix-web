"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
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
      <div className="ui-main-content">
        <ActivitiesSection onUpdate={() => {}} />
      </div>
    </>
  );
}
