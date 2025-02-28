import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/core/Badge";
import { ActionCategory } from '@/lib/types/api/action';

interface OrganizationCategoriesProps {
  onSelect: (category: string) => void;
  selectedActivities: ActionCategory[];
  selectedCategory: string; // Add selectedCategory prop
}

export const OrganizationCategories: React.FC<OrganizationCategoriesProps> = ({
  onSelect,
  selectedActivities,
  selectedCategory, // Destructure selectedCategory
}) => {
  const [coreCategories, setCoreCategories] = useState<ActionCategory[]>([]);
  const [generalCategories, setGeneralCategories] = useState<ActionCategory[]>([]);

  const coreList = ['cm7nd5atu00025n7jczacmikq', 'cm7nd5au5000n5n7jhc6x2khk', 'cm7nd5au900185n7j5qozgig9'];

  // Function to get the count of selected action items in a category
  const getSelectedCount = (categoryId: string): number => {
    const category = selectedActivities.find(cat => cat.id === categoryId);
    if (category && category.actions) {
      return category.actions.filter(action => action).length;
    }
    return 0;
  };

  // Process the categories as soon as selectedActivities changes
  useEffect(() => {
    if (selectedActivities && selectedActivities.length > 0) {
      const coreItems = selectedActivities.filter(category => coreList.includes(category.id));
      setCoreCategories(coreItems);

      const generalItems = selectedActivities.filter(category => !coreList.includes(category.id));
      setGeneralCategories(generalItems);
    }
  }, [selectedActivities]);

  const handleCategorySelect = (categoryId: string) => {
    onSelect(categoryId); // Call the onSelect callback to update the selectedCategory in the parent
  };

  const CategoryItem: React.FC<{
    category: ActionCategory;
    isSelected: boolean;
    onSelect: (categoryId: string) => void;
    selectedCount: number;
  }> = ({
    category,
    isSelected,
    onSelect,
    selectedCount,
  }) => {
    return (
      <li
        className={`text-sm border-l border-border cursor-pointer px-3 py-2 hover:bg-muted flex justify-between items-center ${
          isSelected ? "bg-primary/10 border-l-primary" : ""
        }`}
        onClick={() => onSelect(category.id)}
      >
        <span>{category.name}</span>
        {selectedCount > 0 && (
          <Badge variant="default">
            {selectedCount}
          </Badge>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-2">
          General Responsibilities
        </h3>
        <ul className="space-y-0">
          {coreCategories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              isSelected={selectedCategory === category.id} // Use selectedCategory from props
              onSelect={handleCategorySelect}
              selectedCount={getSelectedCount(category.id)}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-2">
          Core Responsibilities
        </h3>
        <ul className="space-y-0">
          {generalCategories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              isSelected={selectedCategory === category.id} // Use selectedCategory from props
              onSelect={handleCategorySelect}
              selectedCount={getSelectedCount(category.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrganizationCategories;