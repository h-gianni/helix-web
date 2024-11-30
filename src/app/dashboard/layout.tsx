import React from "react";
import Nav from "./_component/NavBar";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Nav />
        </div>
        <div className="col-span-9 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}