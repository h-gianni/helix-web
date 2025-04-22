// File: app/ui-system/ui-content/tokens/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import TokensShowcase from "./Tokens";

export default function TokensShowcasePage() {
  return (
    <ShowcaseLayout
      title="Design Tokens"
      description="Visual design tokens for colors, typography, spacing, and shadows"
    >
      <TokensShowcase />
    </ShowcaseLayout>
  );
}