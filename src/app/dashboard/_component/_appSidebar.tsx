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
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  useSidebar,
  SidebarInset,
} from "@/components/ui/Sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/Collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
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
      { to: "/dashboard/settings/initiatives", label: "Initiatives" },
      { to: "/dashboard/settings/profile", label: "Profile" },
    ],
  },
];

const UserNav = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="neutral"
          className="w-full justify-start p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">shadcn</span>
                <span className="text-xs text-muted-foreground">
                  m@example.com
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start" side="right">
        <div className="space-y-0.5">
          <Button
            variant="neutral"
            className="w-full justify-start gap-2 text-sm"
          >
            <Star className="h-4 w-4" />
            Upgrade to Pro
          </Button>
          <Button
            variant="neutral"
            className="w-full justify-start gap-2 text-sm"
          >
            <Settings className="h-4 w-4" />
            Account
          </Button>
          <Button
            variant="neutral"
            className="w-full justify-start gap-2 text-sm"
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </Button>
          <Button
            variant="neutral"
            className="w-full justify-start gap-2 text-sm"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </Button>

          <div className="px-2 py-1.5">
            <div className="flex items-center text-sm">
              <Sun className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </div>
            <div className="ml-6 mt-1">
              <ThemeSwitcher />
            </div>
          </div>

          <Button
            variant="neutral"
            className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">U</span>
            </div>
            <span className="text-lg font-semibold">UpScore</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {/* <div className="px-2 text-xs font-medium text-sidebar-foreground/70">Navigation</div> */}
            <SidebarMenu>
              {renderNavItems().map((item) => (
                <NavMenuItem key={item.label} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      {/* <SidebarInset>
        Main content will be rendered here by the layout
      </SidebarInset> */}
    </>
  );
};

const NavMenuItem: React.FC<NavMenuItemProps> = ({ item }) => {
  const pathname = usePathname();
  // Initialize isOpen based on whether any subitems match the current pathname
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
                // Prevent the default behavior that might interfere with collapse
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