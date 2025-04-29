"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { ViewSwitcher } from "@/components/ui/composite/ViewSwitcher";
import { PerformersByCategory } from "@/app/dashboard/components/dashboard/standings/PerformersByCategory";
import { usePerformersStore } from "@/store/performers-store";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface IndividualPerformanceTabProps {
  performers: Member[];
  teams: TeamResponse[];
  viewType: "table" | "grid";
  setViewType: (type: "table" | "grid") => void;
}

export default function IndividualPerformanceTab({
  performers,
  teams,
  viewType,
  setViewType,
}: IndividualPerformanceTabProps) {
  const { performanceCategories } = usePerformersStore();
  const [effectiveViewType, setEffectiveViewType] = useState(viewType);
  const [selectedCategory, setSelectedCategory] = useState("global");

  // Update view type based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Force card view on mobile
        setEffectiveViewType("grid");
      } else {
        // Use user's selected view on desktop
        setEffectiveViewType(viewType);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [viewType]);

  // Handle view change
  const handleViewChange = (newViewType: "table" | "grid") => {
    setViewType(newViewType);

    // Only apply if not on mobile
    if (window.innerWidth >= 768) {
      setEffectiveViewType(newViewType);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category filter and view switcher controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">All categories</SelectItem>
              <SelectItem value="customer-centricity">
                Customer Centricity
              </SelectItem>
              <SelectItem value="teamwork">Teamwork</SelectItem>
              <SelectItem value="cultural-behaviors">
                Cultural Behaviors & Values
              </SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product-management">
                Product Management
              </SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select></div>
        <div className="flex gap-4">
          <ViewSwitcher viewType={viewType} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* List of performers by category */}
      {performanceCategories.map((category) => (
        <PerformersByCategory
          key={category.label}
          category={category}
          performers={performers}
          teams={teams}
          viewType={effectiveViewType}
        />
      ))}
    </div>
  );
}
