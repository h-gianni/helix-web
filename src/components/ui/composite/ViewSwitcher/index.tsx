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
        <SelectTrigger data-slot="select-trigger" noBorder>
          <SelectValue data-slot="select-value" placeholder="Select view">
            {viewType === 'table' ? 'Table View' : 'Card View'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent data-slot="select-content" align="end">
          <SelectItem data-slot="select-item" value="table">Table View</SelectItem>
          <SelectItem data-slot="select-item" value="grid">Card View</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}