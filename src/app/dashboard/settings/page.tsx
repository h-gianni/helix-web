"use client";

import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import {
 Card,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/core/Card";
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
       title: "Business Activities",
       description: "Configure and track team activities and performance",
       icon: Target,
       href: "/dashboard/settings/business-activities",
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

 return (
   <>
     <PageBreadcrumbs items={[{ label: "Settings" }]} />
     <PageHeader title="Settings" />

     <main className="layout-page-main">
       {settingsGroups.map((group) => (
         <div key={group.title} className="space-y-4">
           <h2 className="text-xl font-medium">{group.title}</h2>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {group.items.map((item) => {
               const Icon = item.icon;
               return (
                 <Card
                   key={item.title}
                   onClick={() => router.push(item.href)}
                 >
                   <CardHeader>
                     <div className="flex items-center gap-2">
                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                         <Icon className="h-4 w-4 text-primary-600" />
                       </div>
                       <div>
                         <CardTitle>{item.title}</CardTitle>
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
     </main>
   </>
 );
}