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
} from "@/components/ui/Breadcrumb";
import { SidebarTrigger } from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Bell } from "lucide-react";

export interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  return (
    <div className="flex justify-between items-center gap-8 py-4 border-b border-base">
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
          appearance="icon-only"
          size="sm"
          leadingIcon={<Bell className="size-4" />}
          aria-label="Notifications"
        />
        <Avatar size="sm">
          <AvatarImage 
            src="https://github.com/shadcn.png" 
            alt="User avatar" 
          />
          <AvatarFallback>GF</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}