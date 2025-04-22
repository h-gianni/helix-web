// File: app/ui-system/ui-content/team-and-members/page.tsx
import React from "react";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import TeamAndMembersComponents from "./TeamAndMembers";

export default function TeamAndMembersShowcasePage() {
  return (
    <ShowcaseLayout
      title="Team and Members Components"
      description="Components for managing teams and viewing member information"
    >
      <TeamAndMembersComponents />
    </ShowcaseLayout>
  );
}