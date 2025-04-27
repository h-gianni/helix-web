"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/logo/BrandLogo";
import {
  LucideIcon,
  Home,
  Users,
  Settings,
  Star,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from "@/components/ui/composite/Sidebar";
import { useTeams } from "@/lib/context/teams-context";
import { Button } from "@/components/ui/core/Button";
import { usePerformanceRatingStore } from "@/store/performance-rating-store";
import { useNoteStore } from "@/store/note-store";

interface Team {
  id: string;
  name: string;
}

interface SubNavItem {
  to: string;
  label: string;
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  subItems?: SubNavItem[];
  dynamicSubItems?: boolean;
}

interface NavMenuItemProps {
  item: NavItem;
}

const mainNavItems: NavItem[] = [
  {
    to: "/dashboard",
    icon: Home,
    label: "Dashboard",
  },
  {
    to: "/dashboard/teams",
    icon: Users,
    label: "Teams",
    dynamicSubItems: true,
  },
  {
    to: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

function AppSidebar() {
  const { teams, isLoading, fetchTeams } = useTeams();
  const pathname = usePathname();
  const { setIsOpen: openRatingModal } = usePerformanceRatingStore();
  const { setIsOpen: openNoteModal } = useNoteStore();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const renderNavItems = () => {
    return mainNavItems.map((item) => {
      if (item.label === "Teams" && item.dynamicSubItems) {
        return {
          ...item,
          subItems:
            teams?.map((team) => ({
              to: `/dashboard/teams/${team.id}`,
              label: team.name,
            })) || [],
        };
      }
      return item;
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          <BrandLogo size="sm" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Core Actions Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Core Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Score Performance">
                  <button
                    type="button"
                    onClick={() => openRatingModal(true)}
                    className="cursor-pointer"
                  >
                    <Star />
                    <span>Score Performance</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Add Note">
                  <button
                    type="button"
                    onClick={() => openNoteModal(true)}
                    className="cursor-pointer"
                  >
                    <MessageSquare />
                    <span>Add Note</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderNavItems().map((item) => (
                <NavMenuItem key={item.label} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function NavMenuItem({ item }: NavMenuItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === item.to ||
    item.subItems?.some((subItem) => pathname === subItem.to);
  const Icon = item.icon;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
          <Link href={item.to}>
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {item.subItems && item.subItems.length > 0 && (
        <SidebarMenuSub>
          {item.subItems.map((subItem) => (
            <SidebarMenuSubItem key={subItem.to}>
              <SidebarMenuSubButton asChild isActive={pathname === subItem.to}>
                <Link href={subItem.to}>{subItem.label}</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </>
  );
}

export default AppSidebar;