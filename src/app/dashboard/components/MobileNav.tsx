"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/logo/BrandLogo";
import { Button } from "@/components/ui/core/Button";
import {
  Home,
  Users,
  Settings,
  MessageCirclePlus,
  Tally5,
  Menu,
  X,
  Gauge,
  Bell,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useOrgStore } from "@/store/org-store"; // Import the org store

// Mobile Navigation Item Component for the drawer
const MobileNavItem = ({
  title,
  href,
  description,
  onClick,
}: {
  title: string;
  href: string;
  description?: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col gap-1 p-4 hover:bg-muted rounded-md"
    >
      <span className="font-medium">{title}</span>
      {description && (
        <span className="text-sm text-foreground-weak">{description}</span>
      )}
    </Link>
  );
};

// Mobile Navigation Section Component for the drawer
const MobileNavSection = ({
  title,
  items,
  onClick,
}: {
  title: string;
  items: Array<{ title: string; href: string; description?: string }>;
  onClick?: () => void;
}) => {
  return (
    <div className="py-4">
      <h3 className="px-4 text-sm font-semibold text-foreground/70 mb-2">
        {title}
      </h3>
      <div className="flex flex-col">
        {items.map((item) => (
          <MobileNavItem key={item.title} {...item} onClick={onClick} />
        ))}
      </div>
    </div>
  );
};

interface Team {
  id: string;
  name: string;
}

export const MobileBottomNav = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Use organizations from org store instead of useTeams
  const organizations = useOrgStore((state) => state.organizations);

  // Get teams from the first organization if it exists
  const teams = organizations.length > 0 ? organizations[0].teams : [];

  const closeMenu = () => setMenuOpen(false);

  // Main navigation items matching app-sidebar
  const mainNavItems = [
    {
      to: "/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
      badge: {
        value: 1,
        variant: "accent" as const,
      },
    },
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      to: "/dashboard/teams",
      icon: Users,
      label: "Teams",
      subItems:
        teams?.map((team) => ({
          to: `/dashboard/teams/${team.id}`,
          label: team.name,
        })) || [],
    },
    {
      to: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      subItems: [
        {
          to: "/dashboard/settings/org",
          label: "Org Actions",
        },
        {
          to: "/dashboard/settings/teams",
          label: "Teams Actions",
        },
      ],
    },
    {
      to: "/dashboard/account",
      icon: User,
      label: "My Account",
      subItems: [
        {
          to: "/dashboard/account/profile",
          label: "Profile",
        },
        {
          to: "/dashboard/account/subscription",
          label: "Subscription Plan",
        },
        {
          to: "/dashboard/account/billing",
          label: "Billing",
        },
        {
          to: "/logout",
          label: "Logout",
          isDestructive: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Fullscreen Navigation Menu */}
      {true && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col lg:hidden">
          {/* Fixed top header */}
          <div className="sticky top-0 bg-background z-10 border-b border-border">
            <div className="container px-4 py-4">
              <div className="flex items-center justify-between">
                <BrandLogo />
                <Button
                  variant="ghost"
                  icon
                  className="text-foreground hover:text-primary-light"
                  onClick={closeMenu}
                >
                  <X className="size-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-32">
            <div className="container px-4">
              <div className="py-4">
                {mainNavItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.to}
                      onClick={closeMenu}
                      className="flex items-center gap-2 p-4 hover:bg-muted rounded-md"
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant={item.badge.variant} className="ml-auto">
                          {item.badge.value}
                        </Badge>
                      )}
                    </Link>

                    {/* Sub items for Teams, Settings and Account */}
                    {(item.label === "Teams" ||
                      item.label === "My Account" ||
                      item.label === "Settings") &&
                      item.subItems &&
                      item.subItems.length > 0 && (
                        <div className="ml-6 border-l pl-4 border-border">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.to}
                              href={subItem.to}
                              onClick={closeMenu}
                              className={`flex items-center gap-2 p-3 hover:bg-muted rounded-md ${
                                subItem.isDestructive ? "text-destructive" : ""
                              }`}
                            >
                              <span className="text-sm">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar - Always visible */}
      <div className="fixed bottom-0 left-0 z-50 w-full bg-neutral-darkest lg:hidden shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center ${
              pathname === "/dashboard"
                ? "text-primary-light"
                : "text-neutral-base hover:text-primary-light"
            }`}
          >
            <Gauge className="size-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          {/* Teams */}
          <Link
            href="/dashboard/teams"
            className={`flex flex-col items-center justify-center ${
              pathname.startsWith("/dashboard/teams")
                ? "text-primary-light"
                : "text-neutral-base hover:text-primary-light"
            }`}
          >
            <Users className="size-5" />
            <span className="text-xs mt-1">Teams</span>
          </Link>

          {/* Score */}
          <Link
            href="/score"
            className={`flex flex-col items-center justify-center ${
              pathname === "/score"
                ? "text-primary-light"
                : "text-neutral-base hover:text-primary-light"
            }`}
          >
            <Tally5 className="size-5" />
            <span className="text-xs mt-1">Score</span>
          </Link>

          {/* Feedback */}
          <Link
            href="/feedback"
            className={`flex flex-col items-center justify-center ${
              pathname === "/feedback"
                ? "text-primary-light"
                : "text-neutral-base hover:text-primary-light"
            }`}
          >
            <MessageCirclePlus className="size-5" />
            <span className="text-xs mt-1">Feedback</span>
          </Link>

          {/* Menu */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center ${
              isMenuOpen
                ? "text-primary-light"
                : "text-neutral-base hover:text-primary-light"
            }`}
          >
            {isMenuOpen ? (
              <>
                <X className="size-5" />
                <span className="text-xs mt-1">Close</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <Menu className="size-5" />
                  <Badge
                    variant="accent"
                    className="absolute -top-1 -right-3 min-w-4 h-4 px-0 flex items-center justify-center"
                  >
                    1
                  </Badge>
                </div>
                <span className="text-xs mt-1">Menu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
