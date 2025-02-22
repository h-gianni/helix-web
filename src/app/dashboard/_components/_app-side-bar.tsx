"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideIcon,
  Home,
  Users,
  Settings,
} from "lucide-react";
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
import { useTeams } from '@/lib/context/teams-context';

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
    // subItems: [
    //   { to: "/dashboard/settings/business-activities", label: "Org Activities" },
    //   { to: "/dashboard/settings/teams", label: "Teams Activities" },
    //   { to: "/dashboard/settings/profile", label: "Profile" },
    // ],
  },
];

const AppSidebar = () => {
  const { teams, isLoading, fetchTeams } = useTeams();
  const pathname = usePathname();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const renderNavItems = () => {
    return mainNavItems.map(item => {
      if (item.label === "Teams" && item.dynamicSubItems) {
        return {
          ...item,
          subItems: teams?.map(team => ({
            to: `/dashboard/teams/${team.id}`,
            label: team.name
          })) || []
        };
      }
      return item;
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent text-accent-foreground">
            <span className="text-lg font-bold">U</span>
          </div>
          <span className="text-lg font-semibold">UpScore</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {renderNavItems().map((item) => (
              <NavMenuItem key={item.label} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const NavMenuItem: React.FC<NavMenuItemProps> = ({ item }) => {
  const pathname = usePathname();
  const isActive = pathname === item.to || 
    item.subItems?.some(subItem => pathname === subItem.to);
  const Icon = item.icon;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={item.label}
        >
          <Link href={item.to}>
            <Icon />
            <span className="font-medium text-foreground-strong">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {item.subItems && (
        <SidebarMenuSub>
          {item.subItems.map((subItem) => (
            <SidebarMenuSubItem key={subItem.to}>
              <SidebarMenuSubButton
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
};

export default AppSidebar;