// File: app/ui-system/ui-content/core/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import CoreComponents from "./Core";

export default function CoreComponentsShowcasePage() {
  return (
    <ShowcaseLayout
      title="Core Components"
      description="Fundamental UI elements like buttons, inputs, cards, and more"
    >
      <CoreComponents />
    </ShowcaseLayout>
  );
}