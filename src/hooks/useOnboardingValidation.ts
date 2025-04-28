// hooks/useOnboardingValidation.ts

import { useEffect, useState } from 'react';

interface ValidationOptions {
  errorMessage: string;
  validationFn: () => boolean;
}

export function useOnboardingValidation(options: ValidationOptions) {
  const { errorMessage, validationFn } = options;
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Listen for validation events from PageNavigator
  useEffect(() => {
    const handleValidationFailed = () => {
      if (!validationFn()) {
        setError(errorMessage);
        setShowAlert(true);
      }
    };

    document.addEventListener('validation:failed', handleValidationFailed);
    
    return () => {
      document.removeEventListener('validation:failed', handleValidationFailed);
    };
  }, [errorMessage, validationFn]);

  const clearError = () => {
    setError("");
    setShowAlert(false);
  };

  return {
    error,
    showAlert,
    clearError
  };
}