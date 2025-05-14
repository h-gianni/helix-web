import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCheckOnboarding } from "@/store/onboarding-store";

export const useOnboardingRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useCheckOnboarding();

  useEffect(() => {
    console.log("Onboarding check:", {
      pathname,
      isLoading,
      data,
      isOnboardingComplete: data?.isOnboardingComplete
    });

    // Skip redirect if we're already on an onboarding page
    if (pathname?.includes("onboarding")) {
      console.log("Already on onboarding page, skipping redirect");
      return;
    }

    if (!isLoading && data && !data.isOnboardingComplete) {
      console.log("Redirecting to onboarding...");
      router.replace("dashboard/onboarding/intro");
    }
  }, [data, isLoading, router, pathname]);

  return { isLoading };
}; 