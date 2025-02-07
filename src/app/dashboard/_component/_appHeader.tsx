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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/core/Avatar";
import { 
  Bell, 
  Star, 
  Settings, 
  CreditCard,
  LogOut,
  Sun,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  IconWrapper,
} from "@/components/ui/core/DropdownMenu";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { UserButton } from '@clerk/nextjs';

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
        <Avatar size="sm" className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
          <AvatarFallback>GF</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
        <IconWrapper><Star /></IconWrapper>
          Upgrade to Pro
        </DropdownMenuItem>
        <DropdownMenuItem>
        <IconWrapper><Settings /></IconWrapper>
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
        <IconWrapper><CreditCard /></IconWrapper>
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
        <IconWrapper><Bell /></IconWrapper>
          Notifications
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <IconWrapper><ThemeSwitcher /></IconWrapper> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>
        <IconWrapper><LogOut /></IconWrapper>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  return (
    <div className="flex justify-between items-center gap-8 pb-base">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <Breadcrumb className="border-l border-base px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <React.Fragment key={item.label}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href || "#"}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="neutral"
          volume="soft"
          shape="rounded"
          iconOnly
          size="sm"
          leadingIcon={<Bell />}
          aria-label="Notifications"
        />
        <UserNav />
      </div>
    </div>
  );
}