// components/PageBreadcrumbs.tsx
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
    <div className="flex justify-between items-center gap-8 pb-2.5 border-b">
      <div className="flex bg-background items-center gap-1">
        <SidebarTrigger />
        <Breadcrumb className="border-l border-neutral-300 px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  {/* <Home className="size-4" /> */}
                  <span>Dashboard</span>
                </Link>
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
      <div className="flex gap-4 justify-end">
        <Button
          appearance="icon-only"
          aria-label="Add item"
          leadingIcon={<Bell />}
          size="sm"
          variant="neutral"
        />
        <Avatar size="sm">
          <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
          <AvatarFallback>GF</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
