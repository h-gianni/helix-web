// hooks/useActionsSelection.ts used in onboarding

import { useState, useEffect, useCallback } from 'react';
import { useConfigStore } from '@/store/config-store';
import { useActions, MANDATORY_CATEGORIES } from '@/store/action-store';
import { ActionCategory } from '@/lib/types/api/action';
import { useFavoritesStore, useToggleFavorite, useFavorites } from '@/store/favorites-store';

interface UseActionsSelectionOptions {
  categoryType: 'general' | 'core';
  minRequired?: number;
  autoSelect?: boolean;
}

export function useActionsSelection({
  categoryType,
  minRequired = 0,
  autoSelect = false
}: UseActionsSelectionOptions) {
  // Get config data
  const selectedActivities = useConfigStore(state => state.config.activities.selected);
  const selectedByCategory = useConfigStore(state => state.config.activities.selectedByCategory || {});
  const updateActivities = useConfigStore(state => state.updateActivities);
  const updateActivitiesByCategory = useConfigStore(state => state.updateActivitiesByCategory);
  
  // Get actions data
  const { data: actionCategories, isLoading: isLoadingActions } = useActions();
  const [filteredCategories, setFilteredCategories] = useState<ActionCategory[]>([]);
  const [hasPreselected, setHasPreselected] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Favorites state
  const { isLoading: isFavoritesLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = useFavoritesStore(state => state.isFavorite);

  // Filter categories based on type
  useEffect(() => {
    if (actionCategories && actionCategories.length > 0) {
      if (categoryType === 'general') {
        // Filter general (mandatory) categories
        const generalItems = actionCategories.filter(category => 
          MANDATORY_CATEGORIES.includes(category.name)
        );
        setFilteredCategories(generalItems);
      } else {
        // Filter core (non-mandatory) categories
        const coreItems = actionCategories.filter(category => 
          !MANDATORY_CATEGORIES.includes(category.name)
        );
        setFilteredCategories(coreItems);
      }
    }
  }, [actionCategories, categoryType]);

  // Auto-select required actions if enabled
  useEffect(() => {
    if (autoSelect && actionCategories && actionCategories.length > 0 && !hasPreselected) {
      // Find the appropriate categories
      const targetCategories = categoryType === 'general'
        ? actionCategories.filter(cat => MANDATORY_CATEGORIES.includes(cat.name))
        : actionCategories.filter(cat => !MANDATORY_CATEGORIES.includes(cat.name));
      
      if (targetCategories.length > 0) {
        let allActions: string[] = [];
        
        targetCategories.forEach(category => {
          // For general categories, select ALL actions (changed from minimum)
          if (categoryType === 'general') {
            // Get all actions for this category
            const categoryActions = category.actions.map(action => action.id);
            
            // Add to global list
            allActions = [...allActions, ...categoryActions];
            
            // Update by category - select ALL actions
            if (categoryActions.length > 0) {
              updateActivitiesByCategory(category.id, categoryActions);
            }
          } 
          // For core categories, still use the minimum if specified
          else if (minRequired > 0) {
            // Get the actions for this category
            const categoryActions = category.actions.map(action => action.id);
            // Select at least minRequired or all if fewer
            const actionsToSelect = categoryActions.slice(
              0, 
              Math.min(categoryActions.length, minRequired)
            );
            
            // Add to global list
            allActions = [...allActions, ...actionsToSelect];
            
            // Update by category
            if (actionsToSelect.length > 0) {
              updateActivitiesByCategory(category.id, actionsToSelect);
            }
          }
        });
        
        if (allActions.length > 0) {
          updateActivities([...allActions]);
          setHasPreselected(true);
          setHasInteracted(true);
        }
      }
    }
  }, [
    autoSelect,
    actionCategories,
    hasPreselected,
    categoryType,
    minRequired,
    updateActivities,
    updateActivitiesByCategory
  ]);

  // Count selected actions by category type
  const countSelectedActionsByType = useCallback(() => {
    if (!filteredCategories.length) return 0;
    
    // Count categories that have the minimum required actions selected
    return filteredCategories.reduce((count, category) => {
      const selected = selectedByCategory[category.id]?.length || 0;
      if (categoryType === 'general') {
        // For general categories, count ones that meet minimum
        return selected >= minRequired ? count + 1 : count;
      } else {
        // For core categories, count any with at least one selection
        return selected > 0 ? count + 1 : count;
      }
    }, 0);
  }, [filteredCategories, selectedByCategory, categoryType, minRequired]);

  // Check if requirements are met to continue
  const canContinue = useCallback(() => {
    if (!filteredCategories.length) return false;
    
    if (categoryType === 'general') {
      // All mandatory categories must have at least minRequired selections
      return filteredCategories.every(category => {
        const selectedCount = selectedByCategory[category.id]?.length || 0;
        return selectedCount >= minRequired;
      });
    } else {
      // At least one function category must have at least one selection
      return filteredCategories.some(category => {
        const selectedCount = selectedByCategory[category.id]?.length || 0;
        return selectedCount > 0;
      });
    }
  }, [filteredCategories, selectedByCategory, categoryType, minRequired]);

  return {
    selectedActivities,
    selectedByCategory,
    updateActivities,
    updateActivitiesByCategory,
    filteredCategories,
    isLoading: isLoadingActions || isFavoritesLoading,
    isFavorite,
    toggleFavorite,
    hasInteracted,
    setHasInteracted,
    countSelectedActionsByType,
    canContinue
  };
}