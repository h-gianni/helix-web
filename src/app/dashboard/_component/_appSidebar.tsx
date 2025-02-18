"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideIcon,
  Home,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  Star,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  useSidebar,
  SidebarInset,
} from "@/components/ui/composite/Sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/core/Collapsible";
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
  to?: string;
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
    icon: Users,
    label: "Teams",
    dynamicSubItems: true,
  },
  {
    icon: Settings,
    label: "Settings",
    subItems: [
      { to: "/dashboard/settings", label: "All Settings" },
      { to: "/dashboard/settings/teams", label: "Teams" },
      { to: "/dashboard/settings/business-activities", label: "Activities" },
      { to: "/dashboard/settings/profile", label: "Profile" },
    ],
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
          subItems: [
            { to: "/dashboard/teams", label: "View all teams" },
            ...(teams?.map(team => ({
              to: `/dashboard/teams/${team.id}`,
              label: team.name
            })) || [])
          ]
        };
      }
      return item;
    });
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
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
    </>
  );
};

const NavMenuItem: React.FC<NavMenuItemProps> = ({ item }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(() => {
    if (item.subItems) {
      return item.subItems.some(subItem => pathname.startsWith(subItem.to));
    }
    return true;
  });
  
  const isActive = item.to 
    ? pathname === item.to 
    : item.subItems?.some(subItem => pathname === subItem.to) ?? false;
  const hasSubItems = Boolean(item.subItems?.length);
  const Icon = item.icon;

  if (hasSubItems && item.subItems) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            >
              <Icon />
              <span>{item.label}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>
        <CollapsibleContent className="overflow-hidden">
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
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
      >
        <Link href={item.to!}>
          <Icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AppSidebar;