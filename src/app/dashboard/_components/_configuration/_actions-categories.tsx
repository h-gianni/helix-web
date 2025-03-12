import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/core/Badge";
import { ActionCategory } from "@/lib/types/api/action";
import { useConfigStore } from "@/store/config-store";

interface OrganizationCategoriesProps {
  onSelect: (category: string) => void;
  selectedActivities: ActionCategory[];
  selectedCategory: string;
}

export function OrganizationCategories({
  onSelect,
  selectedActivities,
  selectedCategory,
}: OrganizationCategoriesProps) {
  const [generalCategories, setGeneralCategories] = useState<ActionCategory[]>(
    []
  );
  const [coreCategories, setCoreCategories] = useState<ActionCategory[]>([]);

  // Get access to the config store which tracks selected actions
  const config = useConfigStore((state) => state.config);

  // Define the general responsibilities categories by name
  const generalCategoryNames = [
    "Cultural Behaviours & Values",
    "Customer Centricity",
    "Teamwork",
  ];

  // Function to count only SELECTED actions in a category
  const getSelectedCount = (categoryId: string): number => {
    // Check if we have selected actions in the config store
    if (
      config?.activities?.selectedByCategory &&
      config.activities.selectedByCategory[categoryId]
    ) {
      return config.activities.selectedByCategory[categoryId].length;
    }

    return 0;
  };

  useEffect(() => {
    if (selectedActivities && selectedActivities.length > 0) {
      // Group categories by name with exact matching
      const generalItems = selectedActivities.filter((category) =>
        generalCategoryNames.includes(category.name)
      );
      setGeneralCategories(generalItems);

      const coreItems = selectedActivities.filter(
        (category) => !generalCategoryNames.includes(category.name)
      );
      setCoreCategories(coreItems);
    }
  }, [selectedActivities]);

  const handleCategorySelect = (categoryId: string) => {
    onSelect(categoryId);
  };

  const CategoryItem = ({
    category,
    isSelected,
    onSelect,
    selectedCount,
  }: {
    category: ActionCategory;
    isSelected: boolean;
    onSelect: (categoryId: string) => void;
    selectedCount: number;
  }) => {
    return (
      <li
        className={`text-sm border-l border-border cursor-pointer px-3 py-2 hover:bg-muted flex justify-between items-center gap-4 ${
          isSelected ? "bg-primary/10 border-l-primary" : ""
        }`}
        onClick={() => onSelect(category.id)}
      >
        <span>{category.name}</span>
        {selectedCount > 0 && (
          <Badge data-slot="badge" variant="default">
            {selectedCount}
          </Badge>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">General Responsibilities</h3>
        <ul className="space-y-0">
          {generalCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={handleCategorySelect}
              selectedCount={getSelectedCount(category.id)}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">
          Functional Responsibilities
        </h3>
        <ul className="space-y-0">
          {coreCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={handleCategorySelect}
              selectedCount={getSelectedCount(category.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
