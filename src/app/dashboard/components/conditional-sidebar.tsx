"use client";

import React from "react";
import AppSidebar from "./app-sidebar";
import { useSetupProgress } from "@/hooks/useSetupProgress";

export default function ConditionalSidebar() {
  const { showMainDashboard } = useSetupProgress();

  console.log("showMainDashboard:", showMainDashboard);
  
  if (!showMainDashboard) {
    return null;
  }
  
  return <AppSidebar />;
}