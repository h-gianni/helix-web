// app/dashboard/onboarding/layout.tsx

"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProgressBar from "./components/ProgressBar";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";
import { cn } from "@/lib/utils";
import "./onboarding.css";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const pathname = usePathname();
  
  // Check if this is the intro page
  const isIntroPage = pathname === "/dashboard/onboarding/intro";
  
  // Add class for page transitions
  const contentClass = cn(
    "fade-in min-h-screen flex flex-col"
  );
  
  return (
    <div className="onboarding-layout">
      {/* Only show progress bar on non-intro pages */}
      {!isIntroPage && <ProgressBar />}
      
      <div className={contentClass}>
        <main className="flex-1 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}