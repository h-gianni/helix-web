"use client";

import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ProfileSection } from "./_components/_profile";

export default function ProfileSettingsPage() {
  const router = useRouter();
  
  const breadcrumbItems = [
    { label: "Settings", href: "/dashboard/settings" },
    { label: "Profile" },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Profile Settings"
        backButton={{
          onClick: () => router.push("/dashboard/settings/"),
        }}
      />
      <main className="layout-page-main">
        <ProfileSection />
      </main>
    </>
  );
}