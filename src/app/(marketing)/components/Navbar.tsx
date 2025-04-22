"use client";

import * as React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { BrandLogo } from "@/components/logo/BrandLogo";
import { Button } from "@/components/ui/core/Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/composite/NavigationMenu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navConfig } from "@/app/(marketing)/config/navigation-config";

// ListItem component for menu items
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-foreground-weak">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// Desktop Navigation Component
const DesktopNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>What it is</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {navConfig.productNav.map((productNav) => (
                <ListItem
                  key={productNav.title}
                  title={productNav.title}
                  href={productNav.href}
                >
                  {productNav.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Features and benefits</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {navConfig.featuresNav.map((featuresNav) => (
                <ListItem
                  key={featuresNav.title}
                  title={featuresNav.title}
                  href={featuresNav.href}
                >
                  {featuresNav.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        
        {navConfig.mainLinks.map((link) => (
          <NavigationMenuItem key={link.title}>
            <Link href={link.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {link.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export const Navbar = () => {
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-white hidden lg:block">
      <div className="lg:container relative mx-auto min-h-20 flex gap-4 flex-row items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-4 lg:gap-6">
          <BrandLogo size="sm" />

          {/* DESKTOP NAVIGATION */}
          <div className="flex items-center gap-2">
            <DesktopNavigation />
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost">Get the Mobile App</Button>
          <Button variant="ghost">Watch a demo</Button>
          <div className="border-r h-6 hidden md:inline"></div>
          <SignedOut>
            <Button variant="secondary" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild variant="secondary">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};