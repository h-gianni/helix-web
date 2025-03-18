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
    <div className="w-full py-20 lg:py-40 bg-neutral-darkest text-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="marketing-h2 text-white">
                UpScore™
              </h2>
              <p className="marketing-body-lg text-white/50">
                Managing a team today got lesser tough.
              </p>
            </div>
            <div className="flex gap-20 flex-row">
              {/* <div className="flex flex-col marketing-body-sm max-w-lg text-white/50">
                <p>1 Tailwind Way</p>
                <p>Menlo Park</p>
                <p>London, UK 94025</p>
              </div> */}
              <div className="flex gap-4 marketing-body-sm max-w-lg text-background/75">
                <Link href="/">Terms of service</Link>
                <Link href="/">Privacy Policy</Link>
              </div>
            </div>
          </div>
          {/* <div className="grid lg:grid-cols-3 gap-10 items-start">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex text-base gap-1 flex-col items-start"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex justify-between items-center"
                    >
                      <span className="text-lg font-bold">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-lg font-bold">{item.title}</p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center"
                      >
                        <span className="text-white/75">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};