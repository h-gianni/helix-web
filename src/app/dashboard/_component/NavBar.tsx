import React from "react";

import { 
  ChatBubbleLeftEllipsisIcon, 
  UserGroupIcon, 
  Cog6ToothIcon, 

} from "@heroicons/react/24/outline";
import Link from "next/link";


export const Nav = () => {




  const mainNavItems = [
    { to: "/add-feedback", icon: ChatBubbleLeftEllipsisIcon, label: "Add Feedback" },
    { to: "/team", icon: UserGroupIcon, label: "Team" },
    { to: "/settings", icon: Cog6ToothIcon, label: "Settings" },
  ];



  return (
    <nav className="nav ">
      <div className="nav-logo">
        <span className="nav-logo-icon"></span>
        <span className="nav-logo-text">UpScore</span>
      </div>
      <div className="nav-links-container">
        <div className="nav-links">
          {mainNavItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
             className="nav-link"
             
            >
              {item.icon && <item.icon className="nav-link-icon" />}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      
    </nav>
  );
};

export default Nav;