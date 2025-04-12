// app/dashboard/onboarding/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/core/Loader";

export default function OnboardingLandingPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Directly go to intro step - middleware will handle redirects to correct step if needed
    router.replace("/dashboard/onboarding/intro");
  }, [router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader size="lg" />
      <p className="mt-4 text-foreground-weak">Preparing your onboarding experience...</p>
    </div>
  );
}