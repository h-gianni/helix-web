import React, { useState } from 'react';
import { Badge } from "@/components/ui/core/Badge";
import { Check } from "lucide-react";
import { activityCategories, activityData } from '@/data/org-activity-data';

interface OrganizationCategoriesProps {
  onSelect: (category: string) => void;
  selectedActivities: string[];
}

interface Category {
  key: string;
  label: string;
}

export const OrganizationCategories: React.FC<OrganizationCategoriesProps> = ({
  onSelect,
  selectedActivities,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("engineering");

  const handleSelect = (key: string) => {
    setSelectedCategory(key);
    onSelect(key);
  };

  const getSelectedCount = (categoryKey: string) => {
    return selectedActivities.filter((activity) =>
      activityData[categoryKey]?.includes(activity)
    ).length;
  };

  const CategoryItem: React.FC<{categoryKey: string; label: string}> = ({
    categoryKey,
    label,
  }) => {
    const count = getSelectedCount(categoryKey);

    return (
      <li
        className={`text-sm border-l border-border cursor-pointer px-3 py-2 hover:bg-muted flex justify-between items-center ${
          selectedCategory === categoryKey
            ? "bg-primary/10 border-l-primary"
            : ""
        }`}
        onClick={() => handleSelect(categoryKey)}
      >
        <span>{label}</span>
        {count > 0 && (
          <Badge variant="default" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>{count}</span>
          </Badge>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-2">
          General responsibilities
        </h3>
        <ul className="space-y-0">
          {activityCategories.general.map(({ key, label }) => (
            <CategoryItem key={key} categoryKey={key} label={label} />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-2">
          Core Functions
        </h3>
        <ul className="space-y-0">
          {activityCategories.core.map(({ key, label }) => (
            <CategoryItem key={key} categoryKey={key} label={label} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrganizationCategories;