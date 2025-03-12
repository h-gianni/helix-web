"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/core/Breadcrumb";
import { SidebarTrigger } from "@/components/ui/composite/Sidebar";
import { Button } from "@/components/ui/core/Button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/core/Avatar";
import { Bell, Star, Settings, CreditCard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/core/Dropdown-menu";
import { UserButton } from "@clerk/nextjs";
import { useSetupProgress } from "@/hooks/useSetupProgress";

export interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const UserNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-8 rounded-full"
          data-slot="dropdown-trigger"
        >
          <Avatar data-slot="avatar">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
            />
            <AvatarFallback>GF</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        data-slot="dropdown-content"
      >
        {/* <UserButton/> */}
        <DropdownMenuLabel data-slot="dropdown-label">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuItem data-slot="dropdown-item">
          <Star className="mr-2 size-4" />
          <span>Upgrade to Pro</span>
        </DropdownMenuItem>
        <DropdownMenuItem data-slot="dropdown-item">
          <Settings className="mr-2 size-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem data-slot="dropdown-item">
          <CreditCard className="mr-2 size-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem data-slot="dropdown-item">
          <Bell className="mr-2 size-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator data-slot="dropdown-separator" />
        <DropdownMenuItem data-slot="dropdown-item">
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  const { showMainDashboard } = useSetupProgress();

  return (
    <header className="flex items-center justify-between gap-8 pb-4">
      {showMainDashboard ? (
        <div className="flex items-center gap-1 -ml-1.5">
          <SidebarTrigger />
          <Breadcrumb
            className="border-l border-input px-4"
            data-slot="breadcrumb"
          >
            <BreadcrumbList data-slot="breadcrumb-list">
              <BreadcrumbItem data-slot="breadcrumb-item">
                <BreadcrumbLink asChild data-slot="breadcrumb-link">
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator data-slot="breadcrumb-separator" />
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                  <React.Fragment key={item.label}>
                    <BreadcrumbItem data-slot="breadcrumb-item">
                      {isLast ? (
                        <BreadcrumbPage data-slot="breadcrumb-page">
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild data-slot="breadcrumb-link">
                          <Link href={item.href ?? "#"}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator data-slot="breadcrumb-separator" />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ) : (
        <div></div> // Empty div to maintain the flex layout
      )}
      <div className="flex items-center gap-4">
        {<UserButton />}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
