"use client";

import React, { useMemo } from "react";

// Core UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/core/Card";
import { Separator } from "@/components/ui/core/Separator";

// Team & Member Components
import { TeamCard } from "@/components/ui/composite/TeamCard";
import { MemberCard } from "@/components/ui/composite/MemberCard";
import { MembersTable } from "@/components/ui/composite/MembersTable";

// Import extracted data
import TEAMS from "@/app/ui-system/data/teams";
import MEMBERS_DATA, {
  getTeamMembers,
  EMPTY_TEAM_MEMBERS,
} from "@/app/ui-system/data/members";
import {
  PerformanceBadge,
  PerformanceVariant,
} from "@/components/ui/core/PerformanceBadge";
import { TrendBadge, TrendVariant } from "@/components/ui/core/TrendBadge";

// Import components needed for showcases
import StarRating from "@/components/ui/core/StarRating";

// Create simple trend data for demonstration
const performanceTrends = [
  "up" as TrendVariant,
  "stable" as TrendVariant,
  "stable" as TrendVariant,
  "down" as TrendVariant,
  "down" as TrendVariant,
];

const TeamAndMembersComponents = () => {
  // Memoized table data for better performance with added trend data
  const tableMemberData = useMemo(
    () =>
      MEMBERS_DATA.map((member, index) => ({
        ...member,
        averageRating: member.averageRating || 0,
        ratingsCount: member.ratingsCount || 0,
        // Add trend data to each member based on their index
        trend: index < performanceTrends.length 
          ? performanceTrends[index] 
          : performanceTrends[index % performanceTrends.length],
      })),
    []
  );

  // Sample performance values for demonstration
  const performanceValues = [4.7, 4.2, 3.5, 2.7, 1.8];

  return (
    <div className="space-y-8">
      {/* Team Cards Section */}
      <div className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEAMS.slice(0, 3).map((team) => {
            // Assign different member counts
            let teamMembers = EMPTY_TEAM_MEMBERS;
            if (team.id === "team-2") {
              teamMembers = getTeamMembers("team-2", 6); // Marketing team with 6 members
            } else if (team.id !== "team-6") {
              teamMembers = getTeamMembers(team.id, 4);
            }

            return (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                functions={team.functions}
                members={teamMembers}
                averagePerformance={team.id === "team-3" ? undefined : 4.2}
                size="base"
                onClick={() => console.log(`Clicked team: ${team.name}`)}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEAMS.slice(2, 4).map((team) => {
            // Assign different member counts
            let teamMembers = EMPTY_TEAM_MEMBERS;
            if (team.id === "team-4") {
              teamMembers = getTeamMembers("team-4", 8); // Product team with 8 members
            } else if (team.id !== "team-6") {
              teamMembers = getTeamMembers(team.id, 6);
            }

            return (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                functions={team.functions}
                members={teamMembers}
                averagePerformance={team.id === "team-3" ? undefined : 4.5}
                size="lg"
                onClick={() => console.log(`Clicked team: ${team.name}`)}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[TEAMS[5], TEAMS[2]].map((team) => {
            // Assign different member counts for full size cards
            let teamMembers = EMPTY_TEAM_MEMBERS;
            if (team.id === "team-5") {
              teamMembers = getTeamMembers("team-5", 8); // Sales team with 8 members
            } else if (team.id === "team-2") {
              teamMembers = getTeamMembers("team-2", 6); // Marketing team with 6 members
            } else if (team.id !== "team-6") {
              teamMembers = getTeamMembers(team.id);
            }

            return (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                functions={team.functions}
                members={teamMembers}
                averagePerformance={team.id === "team-3" ? undefined : 4.5}
                size="full"
                showActions
                onClick={() => console.log(`Clicked team: ${team.name}`)}
              />
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Mobile/Responsive Member Cards */}
      <div className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tableMemberData.slice(0, 3).map((member, index) => {
            // Determine performance variant based on rating
            const performanceVariant = getPerformanceVariant(member.averageRating);
            
            return (
              <MemberCard
                key={member.id}
                member={member}
                teams={TEAMS}
                category={{
                  label: "", // Will be set by TrendBadge component
                  className: "", // Will be set by TrendBadge component
                  variant: performanceVariant,
                  trend: performanceTrends[index]
                }}
                onNavigate={(path) => console.log(`Navigate to: ${path}`)}
              />
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {performanceValues.map((rating, index) => {
            // Create a sample member for each performance level
            const sampleMember = {
              ...tableMemberData[index % tableMemberData.length],
              id: `sample-${index}`,
              averageRating: rating,
              ratingsCount: 15,
            };

            // Determine performance variant based on rating
            const performanceVariant = getPerformanceVariant(rating);
            
            return (
              <MemberCard
                key={sampleMember.id}
                member={sampleMember}
                teams={TEAMS}
                category={{
                  label: "", // Will be set by TrendBadge component
                  className: "", // Will be set by TrendBadge component
                  variant: performanceVariant,
                  trend: index < performanceTrends.length ? performanceTrends[index] : undefined
                }}
                variant="desktop"
                onNavigate={(path) => console.log(`Navigate to: ${path}`)}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Up trend */}
          <MemberCard
            member={{
              ...tableMemberData[0],
              id: "trend-up",
              averageRating: 4.5,
              ratingsCount: 20,
            }}
            teams={TEAMS}
            category={{
              label: "", // Will be set by TrendBadge component
              className: "", // Will be set by TrendBadge component
              variant: "star",
              trend: "up"
            }}
            variant="desktop"
            onNavigate={(path) => console.log(`Navigate to: ${path}`)}
          />

          {/* Stable trend */}
          <MemberCard
            member={{
              ...tableMemberData[1],
              id: "trend-stable",
              averageRating: 3.8,
              ratingsCount: 12,
            }}
            teams={TEAMS}
            category={{
              label: "", // Will be set by TrendBadge component
              className: "", // Will be set by TrendBadge component
              variant: "solid",
              trend: "stable"
            }}
            variant="desktop"
            onNavigate={(path) => console.log(`Navigate to: ${path}`)}
          />

          {/* Down trend */}
          <MemberCard
            member={{
              ...tableMemberData[2],
              id: "trend-down",
              averageRating: 2.3,
              ratingsCount: 15,
            }}
            teams={TEAMS}
            category={{
              label: "", // Will be set by TrendBadge component
              className: "", // Will be set by TrendBadge component
              variant: "inconsistent",
              trend: "down"
            }}
            variant="desktop"
            onNavigate={(path) => console.log(`Navigate to: ${path}`)}
          />

          {/* No trend data */}
          <MemberCard
            member={{
              ...tableMemberData[3],
              id: "trend-unavailable",
              averageRating: 3.0,
              ratingsCount: 8,
            }}
            teams={TEAMS}
            category={{
              label: "", // Will be set by TrendBadge component
              className: "", // Will be set by TrendBadge component
              variant: "solid",
              // trend is intentionally omitted to demonstrate the unavailable state
            }}
            variant="desktop"
            onNavigate={(path) => console.log(`Navigate to: ${path}`)}
          />
        </div>

      </div>

      <Separator />

      {/* Full Members Table */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>All Team Members</CardTitle>
            <CardDescription>
              View and manage all members across teams
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <MembersTable
              members={tableMemberData}
              teams={TEAMS}
              showAvatar={true}
              showActions={true}
              onDelete={(m) => console.log(`Delete member: ${m.name}`)}
              onGenerateReview={(m) =>
                console.log(`Generate review for: ${m.name}`)
              }
              onNavigate={(path) => console.log(`Navigate to: ${path}`)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engineering Team Members</CardTitle>
            <CardDescription>
              Members belonging to the Engineering team
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <MembersTable
              members={tableMemberData.filter((m) => m.teamId === "team-1")}
              teams={TEAMS}
              teamId="team-1"
              showAvatar={true}
              showActions={true}
              onDelete={(m) => console.log(`Delete member: ${m.name}`)}
              onGenerateReview={(m) =>
                console.log(`Generate review for: ${m.name}`)
              }
              onNavigate={(path) => console.log(`Navigate to: ${path}`)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to determine performance variant based on rating
function getPerformanceVariant(rating: number): PerformanceVariant {
  if (rating >= 4.5) return "star";
  if (rating >= 3.5) return "strong";
  if (rating >= 2.5) return "solid";
  if (rating >= 1.5) return "inconsistent";
  return "low";
}

export default TeamAndMembersComponents;