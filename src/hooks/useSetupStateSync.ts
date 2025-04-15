// src/hooks/useSetupStateSync.ts

import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSetupStore } from '@/store/setup-store';

/**
 * Hook to synchronize the setup state to cookies for middleware usage
 * This helps the middleware determine if the user has completed onboarding
 */
export function useSetupStateSync() {
  const { steps, isSetupComplete } = useSetupStore();
  
  // Update cookie whenever setup state changes
  useEffect(() => {
    const setupComplete = isSetupComplete();
    
    // Set cookie with a long expiration
    Cookies.set('onboarding-complete', setupComplete ? 'true' : 'false', { 
      expires: 365, // 1 year
      path: '/',
      sameSite: 'strict'
    });
    
    // Log to confirm state is synced
    console.log('Setup state synced to cookies:', {
      onboardingComplete: setupComplete,
      steps
    });
  }, [steps, isSetupComplete]);
  
  return null;
}