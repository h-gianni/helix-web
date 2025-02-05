"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { ProfileSection } from "./_components/_profileSelection";

export default function ProfileSettingsPage() {
  return (
    <>
      <PageBreadcrumbs
        items={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Profile" },
        ]}
      />
      <div className="ui-main-content">
        <h1 className="ui-text-heading-1">Profile</h1>
        <ProfileSection />
      </div>
    </>
  );
}
