import React from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export const Nav = () => {
  const mainNavItems = [
    { to: "/dashboard/", icon: ChatBubbleLeftEllipsisIcon, label: "Dashboard" },
    { to: "/dashboard/teams", icon: UsersIcon, label: "Teams" },
    { to: "/dashboard/settings", icon: Cog6ToothIcon, label: "Settings" },
  ];

  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="nav-logo-icon"></span>
        <span className="nav-logo-text">UpScore</span>
      </div>
      <div className="nav-links-container">
        <div className="nav-links">
          {mainNavItems.map((item) => (
            <Link key={item.to} href={item.to} className="nav-link">
              {item.icon && <item.icon className="nav-link-icon" />}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Nav;