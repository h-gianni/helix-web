// File: app/ui-system/ui-content/dashboard/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import AuthenticationShowcase from "./Authentication";

export default function PricingPage() {
  return (
    <ShowcaseLayout
      title="Pricing Components"
      description="Description"
    >
      <AuthenticationShowcase />
    </ShowcaseLayout>
  );
}