"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, Home, Users, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/composite/Side-bar";
import { useTeams } from "@/lib/context/teams-context";

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
    // Example of optional subItems, if needed in the future
    // subItems: [
    //   { to: "/dashboard/settings/business-activities", label: "Org Activities" },
    //   { to: "/dashboard/settings/teams", label: "Teams Activities" },
    //   { to: "/dashboard/settings/profile", label: "Profile" },
    // ],
  },
];

function AppSidebar() {
  const { teams, isLoading, fetchTeams } = useTeams();
  const pathname = usePathname();

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
    <Sidebar data-slot="sidebar">
      <SidebarHeader data-slot="sidebar-header">
        <div className="flex items-center gap-3 px-4 py-4">
          {/* Replace h-8 w-8 with size-8 */}
          <div className="size-8 flex items-center justify-center rounded bg-accent text-accent-foreground">
            <span className="text-lg font-bold">U</span>
          </div>
          <span className="text-lg font-semibold">UpScore</span>
        </div>
      </SidebarHeader>

      <SidebarContent data-slot="sidebar-content">
        <SidebarGroup data-slot="sidebar-group">
          <SidebarMenu data-slot="sidebar-menu">
            {renderNavItems().map((item) => (
              <NavMenuItem key={item.label} item={item} />
            ))}
          </SidebarMenu>
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
      <SidebarMenuItem data-slot="sidebar-menu-item">
        <SidebarMenuButton
          data-slot="sidebar-menu-button"
          asChild
          isActive={isActive}
          tooltip={item.label}
        >
          <Link href={item.to}>
            {/* Apply size-4 to the icon */}
            <Icon className="size-4" />
            <span className="font-medium">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {item.subItems && (
        <SidebarMenuSub data-slot="sidebar-menu-sub">
          {item.subItems.map((subItem) => (
            <SidebarMenuSubItem
              data-slot="sidebar-menu-subitem"
              key={subItem.to}
            >
              <SidebarMenuSubButton
                data-slot="sidebar-menu-subbutton"
                asChild
                isActive={pathname === subItem.to}
              >
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
