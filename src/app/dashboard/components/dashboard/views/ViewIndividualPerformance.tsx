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
import { Filter } from "lucide-react";

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
  const { performanceCategories: performanceLevels } = usePerformersStore();
  const [effectiveViewType, setEffectiveViewType] = useState(viewType);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTeamId, setSelectedTeamId] = useState("all");
  
  // Filter performers based on selected performance level and team
  const filteredPerformers = React.useMemo(() => {
    return performers.filter((performer) => {
      // Filter by team if not "all"
      const teamMatch = selectedTeamId === "all" || performer.teamId === selectedTeamId;
      
      // If level is "all", just apply team filter
      if (selectedLevel === "all") {
        return teamMatch;
      }
      
      // For "not-scored" level
      if (selectedLevel === "not-scored") {
        return performer.ratingsCount === 0 && teamMatch;
      }
      
      // Find the selected level from performance levels
      const level = performanceLevels.find(lvl => 
        lvl.label.toLowerCase().replace(/\s+/g, '-') === selectedLevel
      );
      
      if (!level) return teamMatch;
      
      // Match performers within the rating range of the selected level
      return (
        performer.ratingsCount > 0 &&
        performer.averageRating >= level.minRating &&
        performer.averageRating <= level.maxRating &&
        teamMatch
      );
    });
  }, [performers, selectedLevel, selectedTeamId, performanceLevels]);

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
    <div className="space-y-2">
      {/* Category filter and view switcher controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          {/* Category Select */}
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select performance level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All performance levels</SelectItem>
              {/* Calculate count for Not Scored performers */}
              <SelectItem value="not-scored">
                Not Scored ({performers.filter(p => p.ratingsCount === 0).length})
              </SelectItem>
              {performanceLevels
                .filter(level => level.label !== "Not Scored") // Already added manually above
                .map((level) => {
                  // Count performers that match this level
                  const count = performers.filter(performer => 
                    performer.ratingsCount > 0 && 
                    performer.averageRating >= level.minRating && 
                    performer.averageRating <= level.maxRating
                  ).length;
                  
                  return (
                    <SelectItem 
                      key={level.label} 
                      value={level.label.toLowerCase().replace(/\s+/g, '-')}
                    >
                      {level.label} ({count})
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
          
          {/* Team Select */}
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {teams.map((team) => {
                // Count performers that belong to this team
                const teamMemberCount = performers.filter(p => p.teamId === team.id).length;
                
                return (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name} ({teamMemberCount})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4 mt-3 md:mt-0">
          <ViewSwitcher viewType={viewType} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* If a specific performance level is selected, only show that level */}
      {selectedLevel !== "all" ? (
        // For a specific level selection
        (() => {
          const matchingLevel = selectedLevel === "not-scored" 
            ? performanceLevels.find(level => level.label === "Not Scored")
            : performanceLevels.find(
                level => level.label.toLowerCase().replace(/\s+/g, '-') === selectedLevel
              );
          
          if (matchingLevel) {
            return (
              <PerformersByCategory
                key={matchingLevel.label}
                category={matchingLevel}
                performers={filteredPerformers}
                teams={teams}
                viewType={effectiveViewType}
              />
            );
          }
          return null;
        })()
      ) : (
        // For "All performance levels" selection, show all levels including empty ones
        performanceLevels.map((level) => {
          // Filter performers specific to this level
          const levelPerformers = filteredPerformers.filter(performer => {
            if (level.label === "Not Scored") {
              return performer.ratingsCount === 0;
            }
            return (
              performer.ratingsCount > 0 &&
              performer.averageRating >= level.minRating &&
              performer.averageRating <= level.maxRating
            );
          });

          // Show all levels, even if they don't have any performers
          return (
            <PerformersByCategory
              key={level.label}
              category={level}
              performers={levelPerformers}
              teams={teams}
              viewType={effectiveViewType}
            />
          );
        })
      )}
    </div>
  );
}