// app/dashboard/settings/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users, Target, User } from "lucide-react";

const settingsGroups = [
  {
    title: "Team Management",
    items: [
      {
        title: "Teams",
        description: "Manage team settings and configurations",
        icon: Users,
        href: "/dashboard/settings/teams",
      },
      {
        title: "Initiatives",
        description: "Configure performance tracking initiatives",
        icon: Target,
        href: "/dashboard/settings/initiatives",
      },
    ],
  },
  {
    title: "Personal Settings",
    items: [
      {
        title: "Profile",
        description: "Manage your personal information and preferences",
        icon: User,
        href: "/dashboard/settings/profile",
      },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const breadcrumbItems = [{ label: "Settings" }];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <h1 className="text-display-1">Settings</h1>

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h2 className="text-heading-3 text-foreground">{group.title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    onClick={() => router.push(item.href)}
                    className="cursor-pointer transition-colors hover:bg-accent/50"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-heading-4">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}