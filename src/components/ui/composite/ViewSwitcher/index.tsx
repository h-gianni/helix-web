"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";

interface ViewSwitcherProps {
  viewType: 'table' | 'grid';
  onViewChange: (value: 'table' | 'grid') => void;
}

export function ViewSwitcher({ viewType, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="w-fit">
      <Select 
        value={viewType} 
        onValueChange={onViewChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="table">Table View</SelectItem>
          <SelectItem value="grid">Card View</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}