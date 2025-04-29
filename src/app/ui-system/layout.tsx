"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/core/Button";
import { Card } from "@/components/ui/core/Card";
import { Separator } from "@/components/ui/core/Separator";
import { BrandLogo } from "@/components/logo/BrandLogo";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import {
  ChevronDown,
  ChevronRight,
  Paintbrush,
  LayoutGrid,
  Home,
  Menu,
  X,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";

interface NavItemProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, children, active, onClick }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-1.5 border-l border-neutral-100 text-sm ${
      active
        ? "text-primary-500 font-medium border-primary-500"
        : "text-foreground hover:bg-neutral-50"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

interface NavGroupProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

const NavGroup = ({
  title,
  icon,
  children,
  defaultOpen = false,
}: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-neutral-50 rounded-md"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
      </button>
      {isOpen && <div className="ml-6 space-y-1">{children}</div>}
    </div>
  );
};

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center p-4 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            icon
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="size-5" />
          </Button>
          <BrandLogo size="sm" className="text-neutral-900" />
          <Badge variant="primary-light">UI</Badge>
        </div>

        {/* Theme Switcher added here */}
        <div className="flex items-center">
          <ThemeSwitcher />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={closeSidebar}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 dark:bg-neutral-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <BrandLogo variant="icon" className="size-6" />
                <Button variant="ghost" icon onClick={closeSidebar}>
                  <X className="size-5" />
                </Button>
              </div>
              <nav className="space-y-6">
                <NavItem
                  href="/ui-system"
                  icon={<Home className="size-4" />}
                  active={pathname === "/ui-system"}
                  onClick={closeSidebar}
                >
                  Home
                </NavItem>

                <div className="space-y-2">
                  <h3 className="px-3 heading-upper">Theme Configurator</h3>
                  <div className="space-y-1">
                    <NavItem
                      href="/ui-system/editor/tokenEditor"
                      icon={<Paintbrush className="size-4" />}
                      active={pathname === "/ui-system/editor/tokenEditor"}
                      onClick={closeSidebar}
                    >
                      Color System
                    </NavItem>
                    <NavItem
                      href="/ui-system/editor/typographyEditor"
                      icon={<Paintbrush className="size-4" />}
                      active={pathname === "/ui-system/editor/typographyEditor"}
                      onClick={closeSidebar}
                    >
                      Typography System
                    </NavItem>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="px-3 heading-upper">UI Components</h3>
                  <div className="space-y-1">
                    <NavItem
                      href="/ui-system/ui-content/tokens"
                      icon={<LayoutGrid className="size-4" />}
                      active={pathname === "/ui-system/ui-content/tokens"}
                      onClick={closeSidebar}
                    >
                      Tokens
                    </NavItem>
                    <NavItem
                      href="/ui-system/ui-content/core"
                      icon={<LayoutGrid className="size-4" />}
                      active={pathname === "/ui-system/ui-content/core"}
                      onClick={closeSidebar}
                    >
                      Core Components
                    </NavItem>
                    <NavItem
                      href="/ui-system/ui-content/teamAndMembers"
                      icon={<LayoutGrid className="size-4" />}
                      active={
                        pathname === "/ui-system/ui-content/teamAndMembers"
                      }
                      onClick={closeSidebar}
                    >
                      Team & Members
                    </NavItem>
                    <NavItem
                      href="/ui-system/ui-content/dashboard"
                      icon={<LayoutGrid className="size-4" />}
                      active={pathname === "/ui-system/ui-content/dashboard"}
                      onClick={closeSidebar}
                    >
                      Dashboard
                    </NavItem>
                    <NavItem
                      href="/ui-system/ui-content/authentication"
                      icon={<LayoutGrid className="size-4" />}
                      active={
                        pathname === "/ui-system/ui-content/authentication"
                      }
                      onClick={closeSidebar}
                    >
                      Authentication
                    </NavItem>
                    <NavItem
                      href="/ui-system/ui-content/settings"
                      icon={<LayoutGrid className="size-4" />}
                      active={pathname === "/ui-system/ui-content/settings"}
                      onClick={closeSidebar}
                    >
                      Settings
                    </NavItem>
                    <NavItem
                      href="/ui-system/ui-content/pricing"
                      icon={<LayoutGrid className="size-4" />}
                      active={pathname === "/ui-system/ui-content/pricing"}
                      onClick={closeSidebar}
                    >
                      Pricing
                    </NavItem>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 p-4">
          <nav className="space-y-6">
            <div>
              <NavItem
                href="/ui-system"
                // icon={<Home className="size-4" />}
                active={pathname === "/ui-system"}
              >
                Home
              </NavItem>
              <NavItem
                href="/ui-system/brand"
                // icon={<Target className="size-4" />}
                active={pathname === "/ui-system/brand"}
              >
                Brand
              </NavItem>
            </div>

            <div className="space-y-2">
              <h3 className="pr-3 heading-upper text-neutral-950">
                Foundation
              </h3>
              <div>
                <NavItem
                  href="/ui-system/ui-content/tokens"
                  active={pathname === "/ui-system/ui-content/tokens"}
                >
                  Tokens
                </NavItem>
                <NavItem
                  href="/ui-system/ui-content/core"
                  active={pathname === "/ui-system/ui-content/core"}
                >
                  Core Components
                </NavItem>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="pr-3 heading-upper text-neutral-950">Composite</h3>
              <div>
                <NavItem
                  href="/ui-system/ui-content/teamAndMembers"
                  active={pathname === "/ui-system/ui-content/teamAndMembers"}
                >
                  Team & Members
                </NavItem>
                <NavItem
                  href="/ui-system/ui-content/dashboard"
                  active={pathname === "/ui-system/ui-content/dashboard"}
                >
                  Dashboard
                </NavItem>
                <NavItem
                  href="/ui-system/ui-content/authentication"
                  active={pathname === "/ui-system/ui-content/authentication"}
                >
                  Authentication
                </NavItem>
                <NavItem
                  href="/ui-system/ui-content/settings"
                  active={pathname === "/ui-system/ui-content/settings"}
                >
                  Settings
                </NavItem>
                <NavItem
                  href="/ui-system/ui-content/pricing"
                  active={pathname === "/ui-system/ui-content/pricing"}
                >
                  Pricing
                </NavItem>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="pr-3 heading-upper text-neutral-950">
                Theme Editor
              </h3>
              <div>
                <NavItem
                  href="/ui-system/editor/tokenEditor"
                  active={pathname === "/ui-system/editor/tokenEditor"}
                >
                  Color
                </NavItem>
                <NavItem
                  href="/ui-system/editor/typographyEditor"
                  active={pathname === "/ui-system/editor/typographyEditor"}
                >
                  Typography
                </NavItem>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
