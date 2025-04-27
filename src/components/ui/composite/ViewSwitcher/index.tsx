"use client";

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/core/ToggleGroup";
import { Table, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewSwitcherProps {
  viewType: 'table' | 'grid';
  onViewChange: (value: 'table' | 'grid') => void;
}

export function ViewSwitcher({ viewType, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="w-fit">
      <ToggleGroup 
        type="single" 
        value={viewType} 
        onValueChange={(value) => {
          if (value) onViewChange(value as 'table' | 'grid');
        }}
        size="default"
      >
        <ToggleGroupItem value="table" aria-label="Table View">
          <Table />
          <span className="sr-only md:not-sr-only md:inline-block">Table</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid View">
          <LayoutGrid />
          <span className="sr-only md:not-sr-only md:inline-block">Cards</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}