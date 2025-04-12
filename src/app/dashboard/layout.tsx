// app/dashboard/layout.tsx
"use client";

import React from 'react';
import { useSetupStateSync } from '@/hooks/useSetupStateSync';
import { SidebarProvider } from '@/components/ui/composite/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync setup state to cookies for middleware
  useSetupStateSync();
  
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}