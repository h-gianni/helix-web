"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { ActivitiesSection } from "./_components/_activitiesSection";

export default function BusinessActivitiesSettingsPage() {
 return (
   <div className="space-y-6">
     <PageBreadcrumbs items={[
       { label: "Settings", href: "/dashboard/settings" },
       { label: "Business Activities" }
     ]} />
     <h1 className="text-3xl font-semibold">Business Activities</h1>
     <ActivitiesSection onUpdate={() => {}} />
   </div>
 );
}