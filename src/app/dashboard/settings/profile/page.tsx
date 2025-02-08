"use client";

import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
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
      <main className="ui-layout-page-main">
        <h1 className="ui-text-heading-1">Profile</h1>
        <ProfileSection />
      </main>
    </>
  );
}
