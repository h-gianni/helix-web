"use client";

import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { ProfileSection } from "./_components/_profileSelection";

export default function ProfileSettingsPage() {
 return (
   <div className="space-y-6">
     <PageBreadcrumbs 
       items={[
         { label: "Settings", href: "/dashboard/settings" },
         { label: "Profile" }
       ]} 
     />
     <h1 className="text-3xl font-semibold">Profile Settings</h1>
     <ProfileSection />
   </div>
 );
}