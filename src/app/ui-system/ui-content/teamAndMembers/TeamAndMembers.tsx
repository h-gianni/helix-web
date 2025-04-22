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

const TeamAndMembersComponents = () => {
  // Memoized table data for better performance
  const tableMemberData = useMemo(
    () =>
      MEMBERS_DATA.map((member) => ({
        ...member,
        averageRating: member.averageRating || 0,
        ratingsCount: member.ratingsCount || 0,
      })),
    []
  );

  // Sample performance values for demonstration
  const performanceValues = [4.7, 4.2, 3.5, 2.7, 1.8];

  return (
    <div className="space-y-8">
      {/* Team Cards Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TEAMS.slice(0, 4).map((team) => {
            // Assign different member counts to showcase variety
            let teamMembers = EMPTY_TEAM_MEMBERS;
            if (team.id === "team-1") {
              teamMembers = getTeamMembers("team-1", 8); // Engineering team with 8 members
            } else if (team.id === "team-3") {
              teamMembers = getTeamMembers("team-3", 6); // Design team with 6 members
            } else if (team.id !== "team-6") {
              teamMembers = getTeamMembers(team.id, 4); // Standard 4 members
            }

            return (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                functions={team.functions}
                members={teamMembers}
                averagePerformance={team.id === "team-3" ? undefined : 4.5}
                size="sm"
                onClick={() => console.log(`Clicked team: ${team.name}`)}
              />
            );
          })}
        </div>

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
          {tableMemberData.slice(0, 3).map((member) => {
            // Empty placeholder since we no longer need to pass the category
            const placeholderCategory = {
              label: "",
              minRating: 0,
              maxRating: 5,
              Icon: () => null,
            };
            
            return (
              <MemberCard
                key={member.id}
                member={member}
                teams={TEAMS}
                category={placeholderCategory}
                onDelete={(m) => console.log(`Delete member: ${m.name}`)}
                onGenerateReview={(m) =>
                  console.log(`Generate review for: ${m.name}`)
                }
                onNavigate={(path) => console.log(`Navigate to: ${path}`)}
              />
            );
          })}
        </div>

        {/* Member Cards with Different Performance Levels */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {performanceValues.map((rating, index) => {
            // Create a sample member for each performance level
            const sampleMember = {
              ...tableMemberData[index % tableMemberData.length],
              id: `sample-${index}`,
              averageRating: rating,
              ratingsCount: 15,
            };
            
            // Empty placeholder since we no longer need to pass the category
            const placeholderCategory = {
              label: "",
              minRating: 0,
              maxRating: 5,
              Icon: () => null,
            };

            return (
              <MemberCard
                key={sampleMember.id}
                member={sampleMember}
                teams={TEAMS}
                category={placeholderCategory}
                variant="desktop"
                onNavigate={(path) => console.log(`Navigate to: ${path}`)}
              />
            );
          })}
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

export default TeamAndMembersComponents;