// File: app/ui-system/ui-content/dashboard/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import PricingShowcase from "./Pricing";

export default function PricingPage() {
  return (
    <ShowcaseLayout
      title="Pricing Components"
      description="Description"
    >
      <PricingShowcase />
    </ShowcaseLayout>
  );
}