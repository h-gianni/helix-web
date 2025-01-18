// app/dashboard/settings/profile/page.tsx
"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { ProfileSection } from "./_components/_profileSelection";

export default function ProfileSettingsPage() {
  const breadcrumbItems = [
    { label: "Settings", href: "/dashboard/settings" },
    { label: "Profile" },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <h1 className="text-display-1">Profile Settings</h1>
      <ProfileSection />
    </>
  );
}