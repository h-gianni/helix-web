import React from "react";
import Nav from "./_component/NavBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className=" grid grid-cols-12">
        <div className=" col-span-3">
          <Nav />
        </div>
        <div className="col-span-9 bg-red-400 min-h-screen w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
