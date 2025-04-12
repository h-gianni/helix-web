// app/dashboard/onboarding/components/ProgressBar.tsx

"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/core/Progress";
import Image from "next/image";
import LogoImage from "@/assets/shared/logo.svg";

const ONBOARDING_STEPS = [
  { id: "intro", path: "/dashboard/onboarding/intro", label: "Intro" },
  { id: "organisation", path: "/dashboard/onboarding/organisation", label: "Organisation" },
  { id: "global-actions", path: "/dashboard/onboarding/global-actions", label: "Global Actions" },
  { id: "function-actions", path: "/dashboard/onboarding/function-actions", label: "Function Actions" },
  { id: "members", path: "/dashboard/onboarding/members", label: "Members" },
  { id: "teams", path: "/dashboard/onboarding/teams", label: "Teams" },
  { id: "summary", path: "/dashboard/onboarding/summary", label: "Summary" },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Don't show the header on the intro page
  if (pathname === "/dashboard/onboarding/intro") {
    return null;
  }
  
  const { currentStepIndex, progressSteps, progressPercentage } = useMemo(() => {
    // Calculate current step based on pathname
    const currentStepIndex = ONBOARDING_STEPS.findIndex((step) => step.path === pathname);
    
    // Skip intro page in progress calculation (start from index 1)
    const progressSteps = ONBOARDING_STEPS.slice(1);
    
    // Calculate progress percentage, accounting for intro page
    const progressCurrentStep = currentStepIndex > 0 ? currentStepIndex - 1 : 0;
    const progressPercentage = progressCurrentStep >= 0 
      ? ((progressCurrentStep + 1) / progressSteps.length) * 100
      : 0;
      
    return { currentStepIndex, progressSteps, progressPercentage };
  }, [pathname]);

  return (
    <header className="bg-background sticky top-0 left-0 z-10">
      {/* Progress bar */}
      <Progress value={progressPercentage} className="!h-0.5 !rounded-none" />
    </header>
  );
}