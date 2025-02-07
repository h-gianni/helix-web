"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

type TabsAppearance = "base" | "compact";
type TabsWidth = "inline" | "full";
type TabsSize = "base" | "lg";

type TabsRootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  appearance?: TabsAppearance;
  width?: TabsWidth;
  size?: TabsSize;
};

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsRootProps
>(({ className, appearance = "base", width = "inline", size = "base", ...props }, ref) => (
  <TabsPrimitive.Root 
    ref={ref} 
    className={cn("ui-tabs flex flex-col", className)}
    data-appearance={appearance}
    data-width={width}
    data-size={size}
    {...props} 
  />
));
Tabs.displayName = "Tabs";

type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  appearance?: TabsAppearance;
  width?: TabsWidth;
  size?: TabsSize;
};

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, appearance = "base", width = "inline", size = "base", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("ui-tabs-list w-full", className)}
    data-appearance={appearance}
    data-width={width}
    data-size={size}
    {...props}
  />
));
TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  appearance?: TabsAppearance;
  size?: TabsSize;
};

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, appearance = "base", size = "base", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn("ui-tabs-trigger", className)}
    data-appearance={appearance}
    data-size={size}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("ui-tabs-content mt-4", className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { 
  type TabsAppearance,
  type TabsWidth,
  type TabsSize,
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
};