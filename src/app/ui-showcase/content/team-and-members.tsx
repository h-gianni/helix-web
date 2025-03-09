"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/core/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/core/Tabs";
import { Button } from "@/components/ui/core/Button";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { Separator } from "@/components/ui/core/Separator";
import { TeamCard } from "@/components/ui/composite/Team-card";
import { MemberCard } from "@/components/ui/composite/Member-card";
import { MembersTable } from "@/components/ui/composite/Members-table";
import { ProfileCard } from "@/components/ui/composite/Profile-card";
import { PlusCircle, ChartSpline, UserCircle } from "lucide-react";

// Demo data
const teams = [
  { id: "team-1", name: "Engineering Team", functions: ["Engineering", "DevOps"] },
  { id: "team-2", name: "Marketing Team", functions: ["Marketing", "Social Media"] },
  { id: "team-3", name: "Design Team", functions: ["UI/UX", "Graphic Design"] },
  { id: "team-4", name: "Product Team", functions: ["Product Management", "Market Research"] },
  { id: "team-5", name: "Sales Team", functions: ["Sales", "Customer Success"] },
];

const members = [
  {
    id: "member-1",
    name: "John Doe",
    title: "Senior Developer",
    averageRating: 4.8,
    ratingsCount: 24,
    teamId: "team-1",
    teamName: "Engineering Team"
  },
  {
    id: "member-2",
    name: "Jane Smith",
    title: "UX Designer",
    averageRating: 4.6,
    ratingsCount: 18,
    teamId: "team-3",
    teamName: "Design Team"
  },
  {
    id: "member-3",
    name: "David Johnson",
    title: "Marketing Lead",
    averageRating: 4.2,
    ratingsCount: 15,
    teamId: "team-2",
    teamName: "Marketing Team"
  },
  {
    id: "member-4",
    name: "Maria Garcia",
    title: "Product Manager",
    averageRating: 3.9,
    ratingsCount: 22,
    teamId: "team-4",
    teamName: "Product Team"
  },
  {
    id: "member-5",
    name: "Robert Chen",
    title: "Frontend Developer",
    averageRating: 2.3,
    ratingsCount: 12,
    teamId: "team-1",
    teamName: "Engineering Team"
  }
];

const teamMembers = [
  { id: "tm-1", name: "John Doe", email: "john@example.com", title: "Senior Developer" },
  { id: "tm-2", name: "Robert Chen", email: "robert@example.com", title: "Frontend Developer" },
  { id: "tm-3", name: "Emma Wilson", email: "emma@example.com", title: "Backend Developer" },
  { id: "tm-4", name: "Michael Brown", email: "michael@example.com", title: "DevOps Engineer" },
];

const performanceCategories = [
  {
    label: "Outstanding",
    minRating: 4.5,
    maxRating: 5,
    className: "text-success-darker",
    Icon: ChartSpline
  },
  {
    label: "Exceeds Expectations",
    minRating: 4.0,
    maxRating: 4.49,
    className: "text-success-darker",
    Icon: ChartSpline
  },
  {
    label: "Meets Expectations",
    minRating: 3.0,
    maxRating: 3.99,
    className: "text-primary-darker",
    Icon: ChartSpline
  },
  {
    label: "Needs Improvement",
    minRating: 0,
    maxRating: 2.99,
    className: "text-warning-darker",
    Icon: ChartSpline
  }
];

const profileFields = [
    { label: "Name", value: "John Doe", variant: "title" as const },
    { label: "Job title", value: "Senior Developer" },
    { label: "Team", value: "Engineering Team" },
    { label: "Email", value: "john.doe@example.com" },
    { label: "Location", value: "San Francisco, CA" },
    { label: "Joined", value: "January 15, 2022" },
  ];

const TeamAndMembersTab = () => {
  const [activeTab, setActiveTab] = useState("team-cards");
  
  const getPerformanceCategory = (rating: number, ratingsCount: number) => {
    if (ratingsCount === 0) {
      return {
        label: "Not Rated",
        minRating: 0,
        maxRating: 0,
        className: "text-foreground-weak",
        Icon: ChartSpline
      };
    }
    
    return performanceCategories.find(
      (category) => rating >= category.minRating && rating <= category.maxRating
    ) || performanceCategories[0];
  };

  return (
    <div className="space-y-8 mt-8">
      <div>
        <h2 className="heading-2 mb-2">Team and Members Components</h2>
        <p className="text-muted-foreground">Showcase of team and member management components</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="team-cards">Team Cards</TabsTrigger>
          <TabsTrigger value="member-cards">Member Cards</TabsTrigger>
          <TabsTrigger value="members-table">Members Table</TabsTrigger>
          <TabsTrigger value="profile-card">Profile Card</TabsTrigger>
        </TabsList>
        
        {/* Team Cards Tab */}
        <TabsContent value="team-cards" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Team Card Variants</CardTitle>
              <CardDescription>Different sizes and styles for team cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="heading-3 mb-4">Small Team Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teams.slice(0, 3).map((team) => (
                    <TeamCard
                      key={team.id}
                      id={team.id}
                      name={team.name}
                      functions={team.functions}
                      size="sm"
                      onClick={() => console.log(`Clicked team: ${team.name}`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="heading-3 mb-4">Regular Team Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.slice(0, 2).map((team, index) => (
                    <TeamCard
                      key={team.id}
                      id={team.id}
                      name={team.name}
                      functions={team.functions}
                      members={teamMembers}
                      size="base"
                      onClick={() => console.log(`Clicked team: ${team.name}`)}
                      onEdit={() => console.log(`Edit team: ${team.name}`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="heading-3 mb-4">Large Team Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.slice(2, 4).map((team) => (
                    <TeamCard
                      key={team.id}
                      id={team.id}
                      name={team.name}
                      functions={team.functions}
                      members={teamMembers}
                      averagePerformance={4.5}
                      size="lg"
                      onClick={() => console.log(`Clicked team: ${team.name}`)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Member Cards Tab */}
        <TabsContent value="member-cards" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Member Card Variants</CardTitle>
              <CardDescription>Individual member cards with performance information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {members.slice(0, 6).map((member) => {
                  const category = getPerformanceCategory(member.averageRating, member.ratingsCount);
                  return (
                    <MemberCard
                      key={member.id}
                      member={member}
                      teams={teams}
                      category={category}
                      onDelete={(m) => console.log(`Delete member: ${m.name}`)}
                      onGenerateReview={(m) => console.log(`Generate review for: ${m.name}`)}
                      onNavigate={(path) => console.log(`Navigate to: ${path}`)}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vertical Member Cards</CardTitle>
              <CardDescription>Space-efficient member cards for dense layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {members.slice(0, 4).map((member) => {
                  const category = getPerformanceCategory(member.averageRating, member.ratingsCount);
                  return (
                    <MemberCard
                      key={member.id}
                      member={member}
                      teams={teams}
                      category={category}
                      variant="vert"
                      onNavigate={(path) => console.log(`Navigate to: ${path}`)}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Members Table Tab */}
        <TabsContent value="members-table" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Members Table</CardTitle>
              <CardDescription>Tabular view of team members with actions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MembersTable
                members={members}
                teams={teams}
                showAvatar={true}
                showActions={true}
                performanceCategories={performanceCategories}
                getPerformanceCategory={getPerformanceCategory}
                onDelete={(m) => console.log(`Delete member: ${m.name}`)}
                onGenerateReview={(m) => console.log(`Generate review for: ${m.name}`)}
                onNavigate={(path) => console.log(`Navigate to: ${path}`)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Filtered Members Table</CardTitle>
              <CardDescription>Members table for a specific team</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MembersTable
                members={members.filter(m => m.teamId === "team-1")}
                teams={teams}
                teamId="team-1"
                showAvatar={true}
                showActions={true}
                performanceCategories={performanceCategories}
                getPerformanceCategory={getPerformanceCategory}
                onDelete={(m) => console.log(`Delete member: ${m.name}`)}
                onGenerateReview={(m) => console.log(`Generate review for: ${m.name}`)}
                onNavigate={(path) => console.log(`Navigate to: ${path}`)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profile Card Tab */}
        <TabsContent value="profile-card" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vertical Profile Card</CardTitle>
                <CardDescription>Profile information in a vertical layout</CardDescription>
              </CardHeader>
              <CardContent>
              <ProfileCard
                  align="vertical"
                  imageUrl="/api/placeholder/96/96"
                  fields={profileFields.slice(0, 4)}
                  onEdit={() => console.log("Edit profile")}
                  editButtonPosition="footer"
                  editButtonText="Edit Member Profile"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Horizontal Profile Card</CardTitle>
                <CardDescription>Profile information in a horizontal layout</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileCard
                  align="horizontal"
                  imageUrl="/api/placeholder/96/96"
                  fields={profileFields}
                  onEdit={() => console.log("Edit profile")}
                  editButtonPosition="topRight"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamAndMembersTab;