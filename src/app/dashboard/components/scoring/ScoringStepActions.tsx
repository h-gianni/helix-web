"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/core/Label";
import {
  RadioGroupCards,
  RadioGroupCardsContainer,
  RadioGroupCard,
} from "@/components/ui/core/RadioGroupCards";
import { useTeamActivities } from "@/store/performance-rating-store";
import { Loader, Heart, Building2, PencilRuler, Activity } from "lucide-react";

// Dummy data structured by groups and categories
const DUMMY_ACTIVITIES = {
  favorite: {
    "Saved Favorites": [
      { id: "fav1", name: "Code Review" },
      { id: "fav2", name: "Project Planning" },
      { id: "fav3", name: "Mentoring" },
      { id: "fav4", name: "Daily Standup" },
      { id: "fav5", name: "Documentation" },
      { id: "fav6", name: "Feature Development" },
      { id: "fav7", name: "Knowledge Sharing" },
      { id: "fav8", name: "Quality Assurance" },
    ],
  },
  global: {
    "Organisation values and culture": [
      { id: "gvc1", name: "Demonstrates company values" },
      { id: "gvc2", name: "Promotes inclusive environment" },
      { id: "gvc3", name: "Upholds ethical standards" },
    ],
    Teamwork: [
      { id: "gtw1", name: "Collaborative problem solving" },
      { id: "gtw2", name: "Active participation in meetings" },
      { id: "gtw3", name: "Shares knowledge with team" },
      { id: "gtw4", name: "Provides constructive feedback" },
    ],
    Leadership: [
      { id: "gld1", name: "Takes initiative on projects" },
      { id: "gld2", name: "Mentors junior team members" },
      { id: "gld3", name: "Leads by example" },
      { id: "gld4", name: "Effective decision making" },
    ],
  },
  functions: {
    Engineering: [
      { id: "fen1", name: "Code quality" },
      { id: "fen2", name: "Technical documentation" },
      { id: "fen3", name: "Bug fixing" },
      { id: "fen4", name: "System architecture" },
    ],
    "Product Management": [
      { id: "fpm1", name: "Requirements gathering" },
      { id: "fpm2", name: "Roadmap planning" },
      { id: "fpm3", name: "User story creation" },
      { id: "fpm4", name: "Stakeholder management" },
    ],
    "Product Design": [
      { id: "fpd1", name: "User research" },
      { id: "fpd2", name: "Wireframing" },
      { id: "fpd3", name: "UI design" },
      { id: "fpd4", name: "Usability testing" },
    ],
    Research: [
      { id: "fre1", name: "Data analysis" },
      { id: "fre2", name: "Literature review" },
      { id: "fre3", name: "Competitive analysis" },
      { id: "fre4", name: "Research methodology" },
    ],
  },
};

interface ScoringStepActionsProps {
  teamId: string;
  selectedActivityId: string | undefined;
  setSelectedActivityId: (activityId: string) => void;
}

export default function ScoringStepActions({
  teamId,
  selectedActivityId,
  setSelectedActivityId,
}: ScoringStepActionsProps) {
  const { data: activities = [], isLoading: activitiesLoading } =
    useTeamActivities(teamId);
  const [activeGroup, setActiveGroup] = useState<string>("favorite");

  // Handle activity selection with scroll position preservation
  const handleActivitySelect = (activityId: string) => {
    // Set the selected activity ID
    setSelectedActivityId(activityId);
  };

  // Categories with their icons
  const groups = [
    { id: "favorite", name: "Favorites", icon: <Heart className="size-4" /> },
    { id: "global", name: "Global", icon: <Building2 className="size-4" /> },
    {
      id: "functions",
      name: "Functions",
      icon: <PencilRuler className="size-4" />,
    },
  ];

  // Use real data if available, otherwise fallback to dummy data
  const displayActivitiesCategories =
    activities.length > 0
      ? // Logic for real data would go here
        DUMMY_ACTIVITIES[activeGroup as keyof typeof DUMMY_ACTIVITIES]
      : DUMMY_ACTIVITIES[activeGroup as keyof typeof DUMMY_ACTIVITIES];

  if (activitiesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Selection */}
      <div className="space-y-2">
        {/* <Label className="text-sm font-medium text-foreground">
          Actions Group
        </Label> */}
        <RadioGroupCards
          value={activeGroup}
          onValueChange={setActiveGroup}
          orientation="horizontal"
                className="shadow-sm"
        >
          <RadioGroupCardsContainer
            className="grid grid-cols-3 overflow-hidden rounded-lg"
            layout="compact"
          >
            {groups.map((group, index) => (
              <RadioGroupCard
                key={group.id}
                id={`group-${group.id}`}
                value={group.id}
                title={group.name}
                layout="compact"
                radioSymbol={false}
                containerClassName={index < groups.length - 1 ? "border-r" : ""}
              >
                <div className="flex items-center justify-center gap-2">
                  {group.icon}
                  <span className="hidden sm:inline">{group.name}</span>
                </div>
              </RadioGroupCard>
            ))}
          </RadioGroupCardsContainer>
        </RadioGroupCards>
      </div>

      {/* Categories and Activities Selection */}
      <div className="space-y-6">
        {Object.entries(displayActivitiesCategories).length === 0 ? (
          <div className="p-6 text-center border rounded-lg bg-muted">
            <Activity className="size-8 mx-auto mb-2 text-foreground" />
            <p className="text-foreground">No activities available</p>
          </div>
        ) : (
          Object.entries(displayActivitiesCategories).map(
            ([category, categoryActivities]) => (
              <div key={category} className="space-y-2.5">
                <Label className="!text-foreground-weak">{category}</Label>
                <RadioGroupCards
                  value={selectedActivityId ?? ""}
                  onValueChange={handleActivitySelect}
                >
                  {activeGroup === "favorite" ? (
                    <RadioGroupCardsContainer className="flex flex-col">
                      {categoryActivities.map((activity: any) => (
                        <RadioGroupCard
                          key={activity.id}
                          id={`activity-${activity.id}`}
                          value={activity.id}
                          title={activity.name}
                        >
                          {activity.name}
                        </RadioGroupCard>
                      ))}
                    </RadioGroupCardsContainer>
                  ) : (
                    <RadioGroupCardsContainer
                      className="flex flex-col shadow-sm overflow-hidden rounded-lg"
                      layout="compact"
                    >
                      {categoryActivities.map((activity: any, index) => (
                        <RadioGroupCard
                          key={activity.id}
                          id={`activity-${activity.id}`}
                          value={activity.id}
                          title={activity.name}
                          layout="compact"
                        >
                          {activity.name}
                        </RadioGroupCard>
                      ))}
                    </RadioGroupCardsContainer>
                  )}
                </RadioGroupCards>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
