import React from "react";
import Nav from "./_component/NavBar";
import { ClerkProvider } from "@clerk/nextjs";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="testing">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <Nav />
          </div>
          <div className="col-span-9 min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
};

export default DashboardLayout;