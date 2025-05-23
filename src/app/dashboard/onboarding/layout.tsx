// app/dashboard/onboarding/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProgressBar from "./components/ProgressBar";
import { cn } from "@/lib/utils";
import "./onboarding.css";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const pathname = usePathname();
  
  // Check if this is the intro page
  const isIntroPage = pathname === "/dashboard/onboarding/intro";
  
  return (
    <div className="min-h-screen bg-background">
      {/* Only show progress bar on non-intro pages */}
      {!isIntroPage && <ProgressBar />}
      
      <div className={cn("fade-in min-h-screen flex flex-col")}>
        <main className="flex-1 pb-24 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}