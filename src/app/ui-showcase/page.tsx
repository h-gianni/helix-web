"use client";

import React, { useState } from "react";
// Change this import to use your custom hook
import { useTheme } from "@/components/theme/theme-provider";
import {
  Moon,
  Sun,
  Laptop,
  Calendar as CalendarIcon,
} from "lucide-react";

// Core UI Components
import { Button } from "@/components/ui/core/Button";
import { Separator } from "@/components/ui/core/Separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/core/Tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import AuthenticationFormExample from "./content/authentication";
import DashboardExample from "./content/dashboard";
import PricingExample from "./content/pricing";
import SettingsExample from "./content/settings";
import CoreComponents from "./content/core";
import TeamAndMembers from "./content/team-and-members";
import TokensShowcase from "./content/tokens";


const AdvancedGallery = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="display-1">UI Components</h1>
          <p className="body-lg">
            Tokens and UI examples using shadcn/ui
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme("light")}
                >
                  <Sun
                    className={`h-5 w-5 ${
                      theme === "light" ? "text-primary" : ""
                    }`}
                  />
                  <span className="sr-only">Light mode</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Light mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme("dark")}
                >
                  <Moon
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-primary" : ""
                    }`}
                  />
                  <span className="sr-only">Dark mode</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Dark mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme("system")}
                >
                  <Laptop
                    className={`h-5 w-5 ${
                      theme === "system" ? "text-primary" : ""
                    }`}
                  />
                  <span className="sr-only">System mode</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>System preference</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <Tabs defaultValue="tokens">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="core">Core Components</TabsTrigger>
          <TabsTrigger value="teamandmembers">Team and members</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard Example</TabsTrigger>
          <TabsTrigger value="auth">Authentication Forms</TabsTrigger>
          <TabsTrigger value="settings">Settings Page</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Page</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
          <TokensShowcase />
        </TabsContent>
        <TabsContent value="core">
          <CoreComponents />
        </TabsContent>
        <TabsContent value="teamandmembers">
          <TeamAndMembers />
        </TabsContent>
        <TabsContent value="dashboard">
          <DashboardExample />
        </TabsContent>
        <TabsContent value="auth">
          <AuthenticationFormExample />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsExample />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingExample />
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default AdvancedGallery;