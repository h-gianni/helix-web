"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { InitiativesSection } from "./_components/_initiativesSection";

export default function InitiativesSettingsPage() {
 return (
   <div className="space-y-6">
     <PageBreadcrumbs items={[
       { label: "Settings", href: "/dashboard/settings" },
       { label: "Initiatives" }
     ]} />
     <h1 className="text-3xl font-semibold">Initiatives</h1>
     <InitiativesSection onUpdate={() => {}} />
   </div>
 );
}