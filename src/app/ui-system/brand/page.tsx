// File: app/ui-system/ui-content/team-and-members/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import BrandShowcase from "./Brand";

export default function TeamAndMembersShowcasePage() {
  return (
    <ShowcaseLayout
      title="Brand guidelines"
      description="Description ..."
    >
      <BrandShowcase />
    </ShowcaseLayout>
  );
}