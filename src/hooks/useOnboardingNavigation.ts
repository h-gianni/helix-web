// hooks/useOnboardingNavigation.ts

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingConfig } from './useOnboardingConfig';

export interface NavigationOptions {
  disabledTooltip?: string;
  validateBeforeNavigation?: boolean;
  validateFn?: () => boolean;
}

export function useOnboardingNavigation(
  previousStep: string,
  nextStep: string,
  options: NavigationOptions = {}
) {
  const router = useRouter();
  const { isStepComplete } = useOnboardingConfig();
  const [showError, setShowError] = useState(false);
  
  const {
    disabledTooltip = "Please complete all required fields to continue",
    validateBeforeNavigation = true,
    validateFn
  } = options;
  
  // Handle navigation to previous step
  const goToPreviousStep = useCallback(() => {
    router.push(`/dashboard/onboarding/${previousStep}`);
  }, [router, previousStep]);
  
  // Handle navigation to next step
  const goToNextStep = useCallback(() => {
    // Custom validation function takes precedence
    const canContinue = validateFn ? validateFn() : true;
    
    if (canContinue) {
      router.push(`/dashboard/onboarding/${nextStep}`);
    } else {
      setShowError(true);
      // Dispatch a custom event that parent components can listen for
      const event = new CustomEvent('validation:failed', {
        bubbles: true,
        detail: { message: disabledTooltip }
      });
      document.dispatchEvent(event);
    }
  }, [router, nextStep, validateFn, disabledTooltip]);
  
  return {
    goToPreviousStep,
    goToNextStep,
    showError,
    setShowError
  };
}