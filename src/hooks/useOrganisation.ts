// hooks/useOrganisation.ts

import { useState, useCallback, useEffect } from 'react';
import { useConfigStore } from '@/store/config-store';

export function useOrganisation() {
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateOrganization = useConfigStore(state => state.updateOrganization);

  // Local state for form input
  const [name, setName] = useState(orgConfig.name || "");
  const [error, setError] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  
  // Validation function
  const isValid = useCallback(() => Boolean(name.trim()), [name]);
  
  // Effect to listen for validation events
  useEffect(() => {
    const handleValidationFailed = (event: Event) => {
      if (!isValid()) {
        setError("Organisation name is required");
        setShowAlert(true);
      }
    };
    
    document.addEventListener('validation:failed', handleValidationFailed);
    
    return () => {
      document.removeEventListener('validation:failed', handleValidationFailed);
    };
  }, [isValid]);

  // Handle name change
  const handleNameChange = useCallback((value: string) => {
    setName(value);
    if (error) {
      setError("");
      setShowAlert(false);
    }
    
    // Update the store
    updateOrganization(value.trim());
  }, [updateOrganization, error]);

  // Clear stored name
  const clearName = useCallback(() => {
    updateOrganization("");
    setName("");
    setError("");
    setShowAlert(false);
  }, [updateOrganization]);

  // Clear error
  const clearError = useCallback(() => {
    setError("");
    setShowAlert(false);
  }, []);

  return {
    name,
    isValid,
    handleNameChange,
    clearName,
    error,
    showAlert,
    clearError
  };
}