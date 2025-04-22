// File: app/ui-system/ui-content/settings/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import SettingsShowcase from "./Settings";

export default function SettingsShowcasePage() {
  return (
    <ShowcaseLayout
      title="Settings Components"
      description="Components for managing user preferences and application configuration"
    >
      <SettingsShowcase />
    </ShowcaseLayout>
  );
}