"use client";

import Link from "next/link";

export const Footer = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Product",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "Reports",
          href: "/reports",
        },
        {
          title: "Statistics",
          href: "/statistics",
        },
        {
          title: "Dashboards",
          href: "/dashboards",
        },
        {
          title: "Recordings",
          href: "/recordings",
        },
      ],
    },
    {
      title: "Company",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "About us",
          href: "/about",
        },
        {
          title: "Our Story",
          href: "/our-story",
        },
        {
          title: "Fundraising",
          href: "/fundraising",
        },
        {
          title: "Contact us",
          href: "/contact",
        },
      ],
    },
  ];

  return (
    <div className="w-full px-4 lg:px-8 py-20 lg:py-40 bg-neutral-darkest text-background">
      <div className="container mx-auto space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="marketing-h2 text-white text-center">JustScore</h2>
          <p className="marketing-body-lg text-white/50 text-center">
            Managing a team today got lesser tough.
          </p>
        </div>
        <div className="flex gap-4 marketing-body-sm text-background/75 items-start justify-center">
          <Link href="/">Terms of service</Link>
          <Link href="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};
